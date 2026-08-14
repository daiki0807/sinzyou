import React, { useState, useRef, useEffect } from 'react';

// 5段階のデータ定義
const levelData = {
  4: { face: '😆', label: 'うれしい', color: 'bg-red-400', heightPercent: 100 },
  3: { face: '😊', label: '少しうれしい', color: 'bg-orange-400', heightPercent: 75 },
  2: { face: '😐', label: 'ふつう', color: 'bg-yellow-400', heightPercent: 50 },
  1: { face: '😕', label: '少しかなしい', color: 'bg-cyan-400', heightPercent: 25 },
  0: { face: '😭', label: 'かなしい', color: 'bg-blue-400', heightPercent: 0 },
};

// 付箋の色の定義
const noteColors = {
  yellow: { bg: 'bg-yellow-100', bgDark: 'bg-yellow-200', border: 'border-yellow-200', borderDark: 'border-yellow-300', text: 'text-yellow-800', placeholder: 'placeholder-yellow-500/50', borderLeft: 'border-yellow-300' },
  blue: { bg: 'bg-blue-100', bgDark: 'bg-blue-200', border: 'border-blue-200', borderDark: 'border-blue-300', text: 'text-blue-800', placeholder: 'placeholder-blue-500/50', borderLeft: 'border-blue-300' },
  red: { bg: 'bg-red-100', bgDark: 'bg-red-200', border: 'border-red-200', borderDark: 'border-red-300', text: 'text-red-800', placeholder: 'placeholder-red-500/50', borderLeft: 'border-red-300' },
  green: { bg: 'bg-green-100', bgDark: 'bg-green-200', border: 'border-green-200', borderDark: 'border-green-300', text: 'text-green-800', placeholder: 'placeholder-green-500/50', borderLeft: 'border-green-300' }
};

const colorButtonBg = {
  blue: 'bg-blue-400',
  red: 'bg-red-400',
  yellow: 'bg-yellow-400',
  green: 'bg-green-400'
};

function PlayerArea({ data, onChange, playerLabel }) {
  const sliderRef = useRef(null);

  // スワイプ/ドラッグ/タップ操作の計算（3段階にスナップ）
  const handleMove = (clientY) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const y = clientY - rect.top;
    const height = rect.height;

    // タッチした位置が上から何%か
    const percentage = (y / height) * 100;

    // 5分割してレベルを決定
    let newLevel = 2;
    if (percentage < 20) {
      newLevel = 4;
    } else if (percentage < 40) {
      newLevel = 3;
    } else if (percentage < 60) {
      newLevel = 2;
    } else if (percentage < 80) {
      newLevel = 1;
    } else {
      newLevel = 0;
    }

    if (data.level !== newLevel) {
      onChange({ ...data, level: newLevel });
    }
  };

  // タッチデバイス用
  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientY);
  };

  // マウス操作用
  const handleMouseMove = (e) => {
    if (e.buttons === 1) { // 左クリック押下時のみ
      handleMove(e.clientY);
    }
  };

  const currentData = levelData[data.level];
  const colors = noteColors[data.color] || noteColors.yellow;

  return (
    <div className="flex flex-row w-full max-w-4xl flex-grow gap-4 md:gap-8 mb-6 h-[50vh] min-h-[350px]">
      {/* 左側：温度計エリア */}
      <div className="flex flex-col items-center w-5/12 min-w-[140px] h-full">
        <h2 className="text-lg md:text-xl font-bold text-gray-600 mb-4 whitespace-nowrap">
          いまの きもち {playerLabel && <span className="text-sm ml-1 text-gray-400">({playerLabel})</span>}
        </h2>

        <div className="relative flex flex-row h-full w-full justify-center">
          {/* ラベルエリア（左側） */}
          <div className="flex flex-col justify-between items-end pr-4 py-4 h-full text-lg md:text-xl font-bold text-gray-500">
            <div className={`transition-colors duration-300 ${data.level === 4 ? 'text-red-500 scale-110' : ''}`}>うれしい</div>
            <div className={`transition-colors duration-300 ${data.level === 3 ? 'text-orange-500 scale-110' : ''}`}>少しうれしい</div>
            <div className={`transition-colors duration-300 ${data.level === 2 ? 'text-yellow-600 scale-110' : ''}`}>ふつう</div>
            <div className={`transition-colors duration-300 ${data.level === 1 ? 'text-cyan-500 scale-110' : ''}`}>少しかなしい</div>
            <div className={`transition-colors duration-300 ${data.level === 0 ? 'text-blue-500 scale-110' : ''}`}>かなしい</div>
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

            {/* 5段階の目盛りドット */}
            <div className="absolute top-[8%] w-3 h-3 bg-gray-300 rounded-full z-0"></div>
            <div className="absolute top-[29%] -translate-y-1/2 w-3 h-3 bg-gray-300 rounded-full z-0"></div>
            <div className="absolute top-[50%] -translate-y-1/2 w-3 h-3 bg-gray-300 rounded-full z-0"></div>
            <div className="absolute bottom-[29%] translate-y-1/2 w-3 h-3 bg-gray-300 rounded-full z-0"></div>
            <div className="absolute bottom-[8%] w-3 h-3 bg-gray-300 rounded-full z-0"></div>

            {/* 色が変わる温度バー */}
            <div
              className={`w-8 md:w-10 rounded-full transition-all duration-300 ease-out ${currentData.color} shadow-sm z-10`}
              style={{
                height: `${Math.max(15, currentData.heightPercent)}%`, // 最低限の高さを確保
                minHeight: data.level === 0 ? '15%' : '0%' // 下の時も少し色を残す
              }}
            ></div>

            {/* 操作する顔アイコン */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-lg border-2 border-gray-100 flex items-center justify-center text-5xl md:text-6xl transition-all duration-300 ease-out hover:scale-105 z-20"
              style={{
                bottom: data.level === 0 ? '4%' : data.level === 1 ? 'calc(27% - 16px)' : data.level === 2 ? 'calc(50% - 32px)' : data.level === 3 ? 'calc(73% - 48px)' : 'calc(96% - 64px)'
              }}
            >
              {currentData.face}
            </div>
          </div>
        </div>
      </div>

      {/* 右側：付箋エリア */}
      <div className="flex flex-col flex-grow w-7/12 h-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-2">
          <h2 className="text-lg md:text-xl font-bold text-gray-600">どうして そう おもった？</h2>
          {/* 色選択ボタン */}
          <div className="flex gap-2 bg-white px-2 py-1 rounded-full shadow-sm border border-gray-100">
            {['blue', 'red', 'yellow', 'green'].map(c => (
              <button
                key={c}
                onClick={() => onChange({ ...data, color: c })}
                className={`w-6 h-6 rounded-full border-2 transition-all ${data.color === c ? 'border-gray-500 scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'} ${colorButtonBg[c]}`}
                title="色をかえる"
                aria-label={`${c}色にする`}
              />
            ))}
          </div>
        </div>

        <div className="relative w-full h-full overflow-hidden">
          {/* 付箋の背景 */}
          <div className={`absolute inset-0 ${colors.bgDark} rounded-sm shadow-md transform rotate-1 border ${colors.borderDark} transition-colors duration-300`}></div>
          <div className={`absolute inset-0 ${colors.bg} rounded-sm shadow-lg transform -rotate-1 flex flex-row-reverse p-4 md:p-6 border ${colors.border} transition-colors duration-300`}>

            <div className={`flex flex-col justify-between items-center border-l-2 ${colors.borderLeft} pl-2 ml-4 h-full transition-colors duration-300`}>
              <span className={`${colors.text} font-bold [writing-mode:vertical-rl] tracking-widest text-lg md:text-xl transition-colors duration-300`}>教科書の 本文から</span>
              <span className="text-2xl mt-4">📝</span>
            </div>

            {/* テキスト入力欄 */}
            <textarea
              className={`w-full h-full flex-grow bg-transparent resize-none outline-none text-sm md:text-base leading-snug md:leading-normal text-gray-800 ${colors.placeholder} [writing-mode:vertical-rl] p-2 transition-colors duration-300`}
              placeholder="ここを タップして、教科書の 本文から うちこんでね。"
              value={data.reason}
              onChange={(e) => onChange({ ...data, reason: e.target.value })}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // 状態の初期化時に localStorage から読み込む
  const [isTwoPlayer, setIsTwoPlayer] = useState(() => {
    try {
      const saved = localStorage.getItem('moodApp_isTwoPlayer');
      return saved ? JSON.parse(saved) : false;
    } catch (e) {
      return false;
    }
  });

  const [player1, setPlayer1] = useState(() => {
    try {
      const saved = localStorage.getItem('moodApp_player1');
      return saved ? JSON.parse(saved) : { level: 2, reason: '', color: 'yellow' };
    } catch (e) {
      return { level: 2, reason: '', color: 'yellow' };
    }
  });

  const [player2, setPlayer2] = useState(() => {
    try {
      const saved = localStorage.getItem('moodApp_player2');
      return saved ? JSON.parse(saved) : { level: 2, reason: '', color: 'blue' };
    } catch (e) {
      return { level: 2, reason: '', color: 'blue' };
    }
  });

  // 状態が変わるたびに localStorage に保存
  useEffect(() => {
    localStorage.setItem('moodApp_isTwoPlayer', JSON.stringify(isTwoPlayer));
  }, [isTwoPlayer]);

  useEffect(() => {
    localStorage.setItem('moodApp_player1', JSON.stringify(player1));
  }, [player1]);

  useEffect(() => {
    localStorage.setItem('moodApp_player2', JSON.stringify(player2));
  }, [player2]);

  return (
    <div className="min-h-screen bg-amber-50 p-4 font-sans text-gray-800 flex flex-col items-center select-none overflow-x-hidden">
      {/* タイトル */}
      <h1 className="text-2xl md:text-3xl font-bold text-amber-700 mb-4 mt-2 text-center bg-white px-6 py-2 rounded-full shadow-sm">
        こころの おんどけい
      </h1>

      {/* 1人/2人 切り替えスイッチ */}
      <div className="flex items-center gap-3 mb-6 bg-white px-5 py-2 rounded-full shadow-sm border border-amber-100">
        <span className={`font-bold transition-colors ${!isTwoPlayer ? 'text-amber-700' : 'text-gray-400'}`}>1人</span>
        <button
          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none ${isTwoPlayer ? 'bg-amber-500' : 'bg-gray-300'}`}
          onClick={() => setIsTwoPlayer(!isTwoPlayer)}
          aria-label={isTwoPlayer ? "2人モード" : "1人モード"}
        >
          <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-md ${isTwoPlayer ? 'translate-x-9' : 'translate-x-1'}`} />
        </button>
        <span className={`font-bold transition-colors ${isTwoPlayer ? 'text-amber-700' : 'text-gray-400'}`}>2人</span>
      </div>

      {/* メインエリア */}
      <div className="w-full flex flex-col items-center gap-4">
        {/* 1人目 */}
        <PlayerArea
          data={player1}
          onChange={setPlayer1}
          playerLabel={isTwoPlayer ? "1人目" : ""}
        />

        {/* 2人目 */}
        {isTwoPlayer && (
          <>
            <div className="w-full max-w-4xl border-t-2 border-dashed border-amber-200/70 my-4"></div>
            <PlayerArea
              data={player2}
              onChange={setPlayer2}
              playerLabel="2人目"
            />
          </>
        )}
      </div>
    </div>
  );
}
