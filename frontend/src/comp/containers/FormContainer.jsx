// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"


function FormContainer({ children }) {
    return (
        <motion.div
            className="mt-14 lg:mt-0 w-full max-w-md rounded-3xl p-10 relative border border-white/20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            style={{
                boxShadow: "0 10px 32px rgba(144,103,198,0.95)",
            }}
        >
            {children}
        </motion.div>
    );
}
export default FormContainer