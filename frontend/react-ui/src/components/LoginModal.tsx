import Auth from "./Auth";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    open: boolean;
    onClose: () => void;
    setUser: any;
    mode: "login" | "register";
}

export default function LoginModal({ open, onClose, setUser, mode }: Props) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="modal-bottom-sheet"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                        <button className="modal-close" onClick={onClose}>✕</button>
                        <Auth setUser={setUser} defaultMode={mode} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
