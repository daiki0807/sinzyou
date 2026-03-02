import React, { useState, useRef } from 'react';

export default function App() {
  // 0: かなしい, 1: ふつう, 2: うれしい
  const [level, setLevel] = useState(1);
  const [reason, setReason] = useState('');
  const sliderRef = useRef(null);

  // 3段階のデータ定義
  const levelData = {
    2: { face: '😆', label: 'うれしい', color: 'bg-red-400', heightPercent: 100 },
    1: { face: '😐', label: 'ふつう', color: 'bg-yellow-400', heightPercent: 50 },
    0: { face: '😭', label: 'かなしい', color: 'bg-blue-400', heightPercent: 0 },
  };

  // スワイプ/ドラッグ/タップ操作の計算（3段階にスナップ）
  const handleMove = (clientY) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const y = clientY - rect.top;
    const height = rect.height;

    // タッチした位置が上から何%か
    const percentage = (y / height) * 100;

    // 3分割してレベルを決定
    if (percentage < 33) {
      setLevel(2); // 上
    } else if (percentage < 66) {
      setLevel(1); // 中
    } else {
      setLevel(0); // 下
    }
  };

  // タッチデバイス用
  const handleTouchMove = (e) => {
    // 画面のスクロールを防ぐため、スライダー上でのタッチ操作をキャッチ
    handleMove(e.touches[0].clientY);
  };

  // マウス操作用
  const handleMouseMove = (e) => {
    if (e.buttons === 1) { // 左クリック押下時のみ
      handleMove(e.clientY);
    }
  };

  // 記録ボタンの処理（モックアップ用）
  const handleSave = () => {
    if (!reason) {
      alert('きょうかしょの ほんぶんから かいてね！');
      return;
    }
    // ここで将来的にデータを保存する
    setReason('');
    setLevel(1); // ふつうに戻す
  };

  const currentData = levelData[level];

  return (
    <div className="min-h-screen bg-amber-50 p-4 font-sans text-gray-800 flex flex-col items-center select-none overflow-hidden">
      {/* タイトル */}
      <h1 className="text-2xl md:text-3xl font-bold text-amber-700 mb-6 mt-2 text-center bg-white px-6 py-2 rounded-full shadow-sm">
        こころの おんどけい
      </h1>

      <div className="flex flex-row w-full max-w-4xl flex-grow gap-4 md:gap-8 mb-6 h-[50vh] min-h-[350px]">

        {/* 左側：温度計エリア */}
        <div className="flex flex-col items-center w-5/12 min-w-[140px] h-full">
          <h2 className="text-lg md:text-xl font-bold text-gray-600 mb-4 whitespace-nowrap">いまの きもち</h2>

          <div className="relative flex flex-row h-full w-full justify-center">

            {/* ラベルエリア（左側） */}
            <div className="flex flex-col justify-between items-end pr-4 py-4 h-full text-lg md:text-xl font-bold text-gray-500">
              <div className={`transition-colors duration-300 ${level === 2 ? 'text-red-500 scale-110' : ''}`}>うれしい</div>
              <div className={`transition-colors duration-300 ${level === 1 ? 'text-yellow-600 scale-110' : ''}`}>ふつう</div>
              <div className={`transition-colors duration-300 ${level === 0 ? 'text-blue-500 scale-110' : ''}`}>かなしい</div>
            </div>

            {/* スライダー本体 */}
            <div
              className="relative w-16 md:w-20 bg-white rounded-full h-full border-4 border-gray-200 shadow-inner flex flex-col justify-end items-center py-4 cursor-pointer touch-none"
              ref={sliderRef}
              onTouchMove={handleTouchMove}
              onTouchStart={(e) => handleMove(e.touches[0].clientY)}
              onMouseMove={handleMouseMove}
              onMouseDown={(e) => handleMove(e.clientY)}
            >
              {/* 縦のガイドライン */}
              <div className="absolute inset-y-8 left-1/2 w-1 bg-gray-100 -translate-x-1/2 rounded-full"></div>

              {/* 3段階の目盛りドット */}
              <div className="absolute top-[8%] w-3 h-3 bg-gray-300 rounded-full z-0"></div>
              <div className="absolute top-[50%] -translate-y-1/2 w-3 h-3 bg-gray-300 rounded-full z-0"></div>
              <div className="absolute bottom-[8%] w-3 h-3 bg-gray-300 rounded-full z-0"></div>

              {/* 色が変わる温度バー */}
              <div
                className={`w-8 md:w-10 rounded-full transition-all duration-300 ease-out ${currentData.color} shadow-sm z-10`}
                style={{
                  height: `${Math.max(15, currentData.heightPercent)}%`, // 最低限の高さを確保
                  minHeight: level === 0 ? '15%' : '0%' // 下の時も少し色を残す
                }}
              ></div>

              {/* 操作する顔アイコン */}
              <div
                className="absolute left-1/2 -translate-x-1/2 w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-lg border-2 border-gray-100 flex items-center justify-center text-5xl md:text-6xl transition-all duration-300 ease-out hover:scale-105 z-20"
                style={{
                  bottom: level === 0 ? '4%' : level === 1 ? 'calc(50% - 32px)' : 'calc(96% - 64px)'
                }}
              >
                {currentData.face}
              </div>
            </div>
          </div>
        </div>

        {/* 右側：付箋エリア */}
        <div className="flex flex-col flex-grow w-7/12 h-full">
          <h2 className="text-lg md:text-xl font-bold text-gray-600 mb-4">どうして そう おもった？</h2>

          <div className="relative w-full h-full overflow-hidden">
            {/* 付箋の背景 */}
            <div className="absolute inset-0 bg-yellow-200 rounded-sm shadow-md transform rotate-1 border border-yellow-300"></div>
            <div className="absolute inset-0 bg-yellow-100 rounded-sm shadow-lg transform -rotate-1 flex flex-row-reverse p-4 md:p-6 border border-yellow-200">

              <div className="flex flex-col justify-between items-center border-l-2 border-yellow-300 pl-2 ml-4 h-full">
                <span className="text-yellow-800 font-bold [writing-mode:vertical-rl] tracking-widest text-lg md:text-xl">きょうかしょの ほんぶんから</span>
                <span className="text-2xl mt-4">📝</span>
              </div>

              {/* テキスト入力欄 */}
              <textarea
                className="w-full h-full flex-grow bg-transparent resize-none outline-none text-xl md:text-2xl leading-loose text-gray-800 placeholder-yellow-500/50 [writing-mode:vertical-rl] p-2"
                placeholder="ここを タップして、きょうかしょの ほんぶんから うちこんでね。"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      {/* 記録ボタン */}
      <button
        className="mt-4 mb-4 bg-orange-400 hover:bg-orange-500 text-white font-bold text-xl md:text-2xl py-4 px-12 rounded-full shadow-[0_6px_0_#c2410c] transform transition active:translate-y-1 active:shadow-[0_0px_0_#c2410c]"
        onClick={handleSave}
      >
        きろくする
      </button>

    </div>
  );
}
