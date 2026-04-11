import joi from "joi";
const minAge = 10;

const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - minAge);

export const signUpSchema = joi.object({
    body:joi.object({
        fullName: joi.string().min(3).pattern(/^[A-Za-z\s]+$/).required(),
        email: joi.string().email().required(),
        location: joi.string(),
        password: joi.string().required().min(8).pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        confirmPassword: joi.string().valid(joi.ref('password')).required(),
        birthDate: joi
        .date()
        .less('now')  
        .max(maxDate)
        .required()
        .messages({
            "date.less": "Birth date must be in the past",
            "date.max": "You must be at least 10 years old"
        }),
    gender: joi.string().valid('male', 'female', 'other').required()
}),
 query: joi.object({}),  
 params: joi.object({})
});


export const confirmEmailSchema = joi.object({
    body:joi.object({
        email: joi.string().email().required(),
        code: joi.string().required().length(4)
    }),
 query: joi.object({}),  
 params: joi.object({})
});

export const resendOTPSchema=joi.object({
    body:joi.object({
        email:joi.string().email().required()
    }),
 query: joi.object({}),  
 params: joi.object({})
})

export const loginSchema = joi.object({
    body:joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
    }),
    query: joi.object({}),  
    params: joi.object({})
});

export const refreshTokenSchema = joi.object({
    authorization: joi.string().required()
});

export const forgetPasswordSchema = joi.object({
    body:joi.object({
        email: joi.string().email().required()
    }),
    query: joi.object({}),  
    params: joi.object({})
    
})

export const resetPasswordSchema = joi.object({
    body:joi.object({
    email: joi.string().email().required(),
    code: joi.string().required().length(4),
    newPassword: joi.string().required().min(8).pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    confirmPassword: joi.string().valid(joi.ref('newPassword')).required()
    }),
    query: joi.object({}),  
    params: joi.object({})

})

export const loginWithGoogleSchema = joi.object({
    body:joi.object({
    idToken: joi.string().required().messages({
    "any.required": "Google with Login Failed",
    "string.base": "Google with Login Failed"
  })
    })
    ,
    query: joi.object({}),  
    params: joi.object({})

});

export const signUpWithGoogleSchema = joi.object({
    body:joi.object({
         idToken: joi.string().required(),
        birthDate: joi
        .date()
        .less('now')  
        .max(maxDate)
        .required()
        .messages({
            "date.less": "Birth date must be in the past",
            "date.max": "You must be at least 10 years old"
        }),
        gender: joi.string().valid('male', 'female', 'other').required()
    })
     ,
    query: joi.object({}),  
    params: joi.object({})
   
   
})
