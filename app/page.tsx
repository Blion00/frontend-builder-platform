'use client'

import DocForm from '../components/Form';

export default function Home() {
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Docx Builder Platform
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Tạo tài liệu Docx tự động từ template với dữ liệu người dùng
        </p>
      </div>
      <DocForm />
    </main>
  );
}

