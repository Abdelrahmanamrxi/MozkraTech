import { useEffect, useMemo, useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import api from "../../middleware/api";
import QuizzesHero from "./sections/QuizzesHero";
import QuizzesStats from "./sections/QuizzesStats";
import QuizzesGenerator from "./sections/QuizzesGenerator";
import QuizzesHistory from "./sections/QuizzesHistory";
import QuizzesAttempt from "./sections/QuizzesAttempt";
import QuizzesScoreModal from "./sections/QuizzesScoreModal";

const DEFAULT_FORM = {
  questionType: "MCQ",
  difficultyLevel: "medium",
  numberOfQuestions: "10",
  timeOption: "ai_defined",
  userDuration: "",
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const resolveCorrectIndex = (question) => {
  const directIndex = Number(question?.correctAnswerIndex);
  if (Number.isFinite(directIndex) && directIndex >= 0) {
    return directIndex;
  }
  const options = Array.isArray(question?.options) ? question.options : [];
  const matchIndex = options.findIndex(
    (option) => option === question?.correctAnswer,
  );
  return matchIndex >= 0 ? matchIndex : null;
};

function Quizzes() {
  const { t, i18n } = useTranslation("quizzes");
  const locale = i18n.language === "ar" ? "ar-EG" : "en-US";
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(locale),
    [locale],
  );

  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answersByQuestion, setAnswersByQuestion] = useState({});
  const [viewMode, setViewMode] = useState("list");
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizEndTime, setQuizEndTime] = useState(null);
  const [generatorForm, setGeneratorForm] = useState(DEFAULT_FORM);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [generatorError, setGeneratorError] = useState("");
  const [generatorSuccess, setGeneratorSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [historyNotice, setHistoryNotice] = useState("");
  const [historyError, setHistoryError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [justGeneratedOrSubmittedQuiz, setJustGeneratedOrSubmittedQuiz] =
    useState(null);
  const [showScoreModal, setShowScoreModal] = useState(false);

  // Keep a mutable reference container synchronized to the live state.
  // This shields the asynchronous timer interval thread from stale closures.
  const answersRefContainer = useRef(answersByQuestion);
  useEffect(() => {
    answersRefContainer.current = answersByQuestion;
  }, [answersByQuestion]);

  const {
    data: quizzes = [],
    isLoading: isQuizzesLoading,
    isError: isQuizzesError,
    error: quizzesError,
  } = useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const { data } = await api.get("/quiz/all");
      return data?.data ?? [];
    },
    retry: 1,
    staleTime: 30 * 1000,
  });

  const normalizedQuizzes = useMemo(() => {
    let baseList = [...quizzes];
    if (justGeneratedOrSubmittedQuiz) {
      const targetIndex = baseList.findIndex(
        (q) => q._id === justGeneratedOrSubmittedQuiz._id,
      );
      if (targetIndex !== -1) {
        baseList[targetIndex] = justGeneratedOrSubmittedQuiz;
      } else {
        baseList.unshift(justGeneratedOrSubmittedQuiz);
      }
    }
    return baseList.map((quiz) => ({
      ...quiz,
      status: quiz.status ?? "in_progress",
      numberOfQuestions:
        Number(quiz.numberOfQuestions) || quiz.questions?.length || 0,
      durationMinutes: Number(quiz.durationMinutes) || 0,
    }));
  }, [quizzes, justGeneratedOrSubmittedQuiz]);

  const activeQuiz = useMemo(() => {
    return normalizedQuizzes.find((quiz) => quiz._id === activeQuizId) ?? null;
  }, [normalizedQuizzes, activeQuizId]);

  const filteredQuizzes = useMemo(() => {
    if (filter === "completed") {
      return normalizedQuizzes.filter((quiz) => quiz.status === "completed");
    }
    if (filter === "in_progress") {
      return normalizedQuizzes.filter((quiz) => quiz.status !== "completed");
    }
    return normalizedQuizzes;
  }, [filter, normalizedQuizzes]);

  useEffect(() => {
    if (!quizEndTime) return;
    if (viewMode !== "attempt") return;

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((quizEndTime - Date.now()) / 1000),
      );
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        handleAutoSubmit();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [quizEndTime, viewMode]);

  const stats = useMemo(() => {
    const total = normalizedQuizzes.length;
    const completedQuizzes = normalizedQuizzes.filter(
      (quiz) => quiz.status === "completed",
    );
    const completed = completedQuizzes.length;
    const inProgress = Math.max(total - completed, 0);

    const avgScore = completed
      ? completedQuizzes.reduce((sum, quiz) => {
          const percent = Number(quiz.percentage);
          if (Number.isFinite(percent)) {
            return sum + percent;
          }
          const totalQuestions =
            Number(quiz.numberOfQuestions) || quiz.questions?.length || 0;
          if (!totalQuestions) {
            return sum;
          }
          const score = Number(quiz.score) || 0;
          return sum + (score / totalQuestions) * 100;
        }, 0) / completed
      : null;

    return { total, completed, inProgress, avgScore };
  }, [normalizedQuizzes]);

  const generateMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post("/quiz", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },

    onSuccess: (resData) => {
      console.log("GENERATE RESPONSE:", resData);
      setGeneratorSuccess(t("generator.success"));
      setGeneratorError("");
      setHistoryNotice("");
      setSelectedFile(null);
      setFileInputKey((current) => current + 1);

      const absoluteQuiz = resData?.data ?? resData;
      if (absoluteQuiz?._id) {
        setJustGeneratedOrSubmittedQuiz(absoluteQuiz);
        setActiveQuizId(absoluteQuiz._id);
        setViewMode("attempt");
        setCurrentQuestionIndex(0);
        setAnswersByQuestion({});
        const endTime =
          new Date(absoluteQuiz.createdAt).getTime() +
          absoluteQuiz.durationMinutes * 60 * 1000;
        setQuizEndTime(endTime);
        const remaining = Math.max(
          0,
          Math.floor((endTime - Date.now()) / 1000),
        );
        setTimeLeft(remaining);
      }
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
    onError: (error) => {
      setGeneratorError(getErrorMessage(error, t("generator.error")));
      setGeneratorSuccess("");
    },
  });

  const submitMutation = useMutation({
    mutationFn: async ({ quizId, payload }) => {
      const response = await api.post(`/quiz/submit/${quizId}`, payload);
      return response.data;
    },
    onSuccess: (resData) => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      setSubmitError("");
      setHistoryError("");

      const submittedQuizData = resData?.data ?? resData;
      if (submittedQuizData?._id) {
        setJustGeneratedOrSubmittedQuiz(submittedQuizData);

        const seededAnswers = {};
        const sourceAnswers =
          submittedQuizData.userAnswers || submittedQuizData.answers || [];

        sourceAnswers.forEach((answer) => {
          if (answer.questionNumber !== undefined) {
            seededAnswers[answer.questionNumber] =
              answer.selectedAnswer ?? null;
          }
        });

        setAnswersByQuestion(seededAnswers);
        setShowScoreModal(true);
      } else {
        setViewMode("list");
        setActiveQuizId(null);
      }
    },
    onError: (error) => {
      setSubmitError(getErrorMessage(error, t("attempt.submitError")));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (quizId) => {
      await api.delete(`/quiz/delete/${quizId}`);
      return quizId;
    },
    onMutate: (quizId) => {
      setDeletingId(quizId);
      setHistoryError("");
      setHistoryNotice("");
    },
    onSuccess: (deletedId) => {
      if (justGeneratedOrSubmittedQuiz?._id === deletedId) {
        setJustGeneratedOrSubmittedQuiz(null);
      }
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      setHistoryNotice(t("history.deleteSuccess"));
    },
    onError: (error) => {
      setHistoryError(getErrorMessage(error, t("history.loadError")));
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleFormChange = (field, value) => {
    setGeneratorForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "timeOption" && value === "ai_defined") {
        next.userDuration = "";
      }
      return next;
    });
    setGeneratorError("");
    setGeneratorSuccess("");
  };

  const handleGenerateQuiz = () => {
    setGeneratorError("");
    setGeneratorSuccess("");
    if (!selectedFile) {
      setGeneratorError(t("generator.fileRequired"));
      return;
    }
    const questionCount = Number(generatorForm.numberOfQuestions);
    if (
      !Number.isFinite(questionCount) ||
      questionCount < 1 ||
      questionCount > 50
    ) {
      setGeneratorError(t("generator.questionsInvalid"));
      return;
    }
    let durationValue = null;
    if (generatorForm.timeOption === "user_defined") {
      durationValue = Number(generatorForm.userDuration);
      if (
        !Number.isFinite(durationValue) ||
        durationValue < 1 ||
        durationValue > 60
      ) {
        setGeneratorError(t("generator.durationRequired"));
        return;
      }
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("questionType", generatorForm.questionType);
    formData.append("difficultyLevel", generatorForm.difficultyLevel);
    formData.append("numberOfQuestions", String(questionCount));
    formData.append("timeOption", generatorForm.timeOption);
    if (durationValue) {
      formData.append("userDuration", String(durationValue));
    }
    generateMutation.mutate(formData);
  };

  const handleStartQuiz = (quiz, mode = "attempt") => {
    // ✅ Always grab the freshest version from the normalized list
    const freshQuiz = normalizedQuizzes.find((q) => q._id === quiz._id) ?? quiz;

    setActiveQuizId(freshQuiz._id);
    setViewMode(mode);
    setSubmitError("");
    setHistoryError("");
    setHistoryNotice("");

    if (mode === "review") {
      const seededAnswers = {};
      const sourceAnswers = freshQuiz.userAnswers || freshQuiz.answers || [];
      sourceAnswers.forEach((ans) => {
        if (ans.questionNumber !== undefined) {
          seededAnswers[ans.questionNumber] = ans.selectedAnswer ?? null;
        }
      });
      setAnswersByQuestion(seededAnswers);
      setCurrentQuestionIndex(0);
    } else {
      // ✅ Restore saved answers and question index from fresh quiz
      const seededAnswers = {};
      (freshQuiz.userAnswers ?? []).forEach((ans) => {
        if (ans.questionNumber !== undefined) {
          seededAnswers[ans.questionNumber] = ans.selectedAnswer ?? null;
        }
      });
      console.log("Restoring from freshQuiz:", freshQuiz.userAnswers); // temp debug
      setAnswersByQuestion(seededAnswers);
      setCurrentQuestionIndex(freshQuiz.currentQuestionIndex ?? 0);

      const endTime =
        new Date(freshQuiz.createdAt).getTime() +
        freshQuiz.durationMinutes * 60 * 1000;
      setQuizEndTime(endTime);
      setTimeLeft(Math.max(0, Math.floor((endTime - Date.now()) / 1000)));
    }
  };
  const handleExitAttempt = async () => {
    if (
      activeQuiz &&
      activeQuiz.status !== "completed" &&
      Object.keys(answersByQuestion).length > 0
    ) {
      const questions = activeQuiz.questions ?? [];
      const userAnswers = questions
        .filter((q) => answersByQuestion[q.questionNumber] !== undefined)
        .map((q) => ({
          questionNumber: q.questionNumber,
          selectedAnswer: answersByQuestion[q.questionNumber],
          isCorrect: false,
        }));

      try {
        await api.patch(`/quiz/progress/${activeQuiz._id}`, {
          userAnswers,
          currentQuestionIndex,
        });
        // ✅ Wait for the refetch to complete before showing the list
        await queryClient.invalidateQueries({ queryKey: ["quizzes"] });
        await queryClient.refetchQueries({ queryKey: ["quizzes"] });
      } catch (err) {
        console.error("Failed to save progress:", err);
      }
    }

    setViewMode("list");
    setActiveQuizId(null);
    setCurrentQuestionIndex(0);
    setAnswersByQuestion({});
    setSubmitError("");
    setShowScoreModal(false);
  };
  const handleReviewFromModal = () => {
    setShowScoreModal(false);
    setViewMode("review");
    setCurrentQuestionIndex(0);
  };

  const handleAutoSubmit = () => {
    if (!activeQuiz) return;
    const questions = Array.isArray(activeQuiz.questions)
      ? activeQuiz.questions
      : [];

    // Pull from the synchronized reference container to sidestep stale closure issues
    const currentLiveAnswers = answersRefContainer.current;

    // Timer ended: Map real values, and leave missing slots as null for the database payload
    const userAnswers = questions.map((question) => {
      const selectedAnswer =
        currentLiveAnswers[question.questionNumber] ?? null;
      const correctIndex = resolveCorrectIndex(question);
      const isCorrect =
        selectedAnswer !== null &&
        correctIndex !== null &&
        Number(selectedAnswer) === correctIndex;

      return {
        questionNumber: question.questionNumber,
        selectedAnswer,
        isCorrect,
      };
    });

    const score = userAnswers.filter((answer) => answer.isCorrect).length;
    const percentage = Math.round((score / questions.length) * 100);

    submitMutation.mutate({
      quizId: activeQuiz._id,
      payload: {
        userAnswers,
        score,
        percentage,
        completedAt: new Date().toISOString(),
        status: "completed",
      },
    });
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) {
      setSubmitError(t("attempt.submitError"));
      return;
    }
    const questions = Array.isArray(activeQuiz.questions)
      ? activeQuiz.questions
      : [];
    if (!questions.length) {
      setSubmitError(t("attempt.submitError"));
      return;
    }

    // Manual Click: Detect if any question integers are missing from the state collection map
    const unansweredQuestions = questions.filter(
      (question) =>
        answersByQuestion[question.questionNumber] === undefined ||
        answersByQuestion[question.questionNumber] === null,
    );

    // Hard block user and show warning text
    if (unansweredQuestions.length > 0) {
      setSubmitError(`Please answer all questions before submitting.`);
      return;
    }

    // Process submission map safely knowing everything has an option assigned
    const userAnswers = questions.map((question) => {
      const selectedAnswer = answersByQuestion[question.questionNumber];
      const correctIndex = resolveCorrectIndex(question);
      const isCorrect =
        selectedAnswer !== null &&
        selectedAnswer !== undefined &&
        correctIndex !== null &&
        Number(selectedAnswer) === correctIndex;

      return {
        questionNumber: question.questionNumber,
        selectedAnswer,
        isCorrect,
      };
    });

    const score = userAnswers.filter((answer) => answer.isCorrect).length;
    const percentage = Math.round((score / questions.length) * 100);

    submitMutation.mutate({
      quizId: activeQuiz._id,
      payload: {
        userAnswers,
        score,
        percentage,
        completedAt: new Date().toISOString(),
        status: "completed",
      },
    });
  };

  const displayAverageScore = stats.avgScore
    ? `${numberFormatter.format(stats.avgScore.toFixed(1))}%`
    : t("misc.notAvailable");

  return (
    <main className="text-white main-background min-h-screen lg:p-15 p-5 sm:p-8 relative">
      <QuizzesHero />
      <QuizzesStats
        stats={{ ...stats, avgScoreLabel: displayAverageScore }}
        isLoading={isQuizzesLoading}
      />
      {viewMode !== "list" && activeQuiz ? (
        <QuizzesAttempt
          quiz={activeQuiz}
          mode={viewMode}
          currentQuestionIndex={currentQuestionIndex}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          answersByQuestion={answersByQuestion}
          setAnswersByQuestion={setAnswersByQuestion}
          onExit={handleExitAttempt}
          onSubmit={handleSubmitQuiz}
          isSubmitting={submitMutation.isPending}
          error={submitError}
          timeLeft={timeLeft}
        />
      ) : (
        <div className="space-y-8">
          <QuizzesGenerator
            form={generatorForm}
            file={selectedFile}
            fileInputKey={fileInputKey}
            isGenerating={generateMutation.isPending}
            error={generatorError}
            success={generatorSuccess}
            onFormChange={handleFormChange}
            onFileChange={(file) => {
              setSelectedFile(file);
              setGeneratorError("");
              setGeneratorSuccess("");
            }}
            onSubmit={handleGenerateQuiz}
          />
          <QuizzesHistory
            quizzes={filteredQuizzes}
            filter={filter}
            onFilterChange={setFilter}
            isLoading={isQuizzesLoading}
            isError={isQuizzesError}
            errorMessage={
              isQuizzesError
                ? getErrorMessage(quizzesError, t("history.loadError"))
                : historyError
            }
            notice={historyNotice}
            onStart={(quiz) => handleStartQuiz(quiz, "attempt")}
            onReview={(quiz) => handleStartQuiz(quiz, "review")}
            onDelete={(quizId) => deleteMutation.mutate(quizId)}
            deletingId={deletingId}
          />
        </div>
      )}
      <QuizzesScoreModal
        isOpen={showScoreModal}
        score={justGeneratedOrSubmittedQuiz?.score ?? 0}
        totalQuestions={justGeneratedOrSubmittedQuiz?.numberOfQuestions ?? 0}
        percentage={justGeneratedOrSubmittedQuiz?.percentage ?? 0}
        onReview={handleReviewFromModal}
        onClose={handleExitAttempt}
      />
    </main>
  );
}

export default Quizzes;
