import React from 'react';
import { motion } from 'framer-motion';
import FileUploader from '../components/Form';

const FormPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen flex items-center justify-center bg-gray-50 p-4"
    >
      <div className="w-full max-w-md">
        <FileUploader />
      </div>
    </motion.div>
  );
};

export default FormPage;