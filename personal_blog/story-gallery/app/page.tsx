import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-dark-500 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-primary-500 mb-6">
          故事影像馆
        </h1>
        <p className="text-lg mb-8 text-gray-300">
          分享生活中的美好瞬间
        </p>
        
        {/* 测试自定义颜色 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-primary-50 text-primary-900 p-6 rounded-lg">
            <h3 className="font-semibold">Primary 50</h3>
            <p>浅蓝色主题</p>
          </div>
          <div className="bg-primary-500 text-white p-6 rounded-lg">
            <h3 className="font-semibold">Primary 500</h3>
            <p>标准蓝色主题</p>
          </div>
          <div className="bg-primary-900 text-white p-6 rounded-lg">
            <h3 className="font-semibold">Primary 900</h3>
            <p>深蓝色主题</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-50 text-white p-6 rounded-lg">
            <h3 className="font-semibold">Dark 50</h3>
            <p>浅暗色主题</p>
          </div>
          <div className="bg-dark-500 border border-gray-600 text-white p-6 rounded-lg">
            <h3 className="font-semibold">Dark 500</h3>
            <p>标准暗色主题</p>
          </div>
          <div className="bg-dark-900 text-white p-6 rounded-lg">
            <h3 className="font-semibold">Dark 900</h3>
            <p>深暗色主题</p>
          </div>
        </div>
        
        {/* 测试响应式 */}
        <div className="mt-8 p-6 bg-gray-800 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">响应式测试</h3>
          <div className="text-sm sm:text-base md:text-lg lg:text-xl">
            这个文字在不同屏幕尺寸下会有不同大小
          </div>
        </div>
      </div>
    </main>
  );
}
