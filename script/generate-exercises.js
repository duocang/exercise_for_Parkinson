const fs = require('fs');
const path = require('path');

// 配置项
const config = {
  videoRoot: path.join(__dirname, '../public/videos'),
  outputFile: path.join(__dirname, '../src/data/exercises.js'),
  durationMap: {
    morning: "视频看4次，跟着做4次",
    noon: "3组×10次",
    evening: "每组保持30秒"
  },
  defaultType: '',
  nameRules: {
    pattern: /(.*?)(\d{2,})$/,  // 严格匹配末尾数字
    replacements: {
      morning: "",
      noon: "",
      evening: ""
    }
  }
};

// 增强版自然排序函数（支持中文拼音排序）
const naturalCompare = (a, b) => {
  const collator = new Intl.Collator('zh-Hans', { numeric: true });

  // 分离名称和序号
  const parse = (str) => {
    const match = str.match(/(.*?)(\d+)$/);
    return {
      name: match ? match[1] : str,
      num: match ? parseInt(match[2], 10) : 0
    };
  };

  const aParts = parse(a);
  const bParts = parse(b);

  // 先比较名称（中文拼音）
  const nameCompare = collator.compare(aParts.name, bParts.name);
  // 再比较数字
  return nameCompare || aParts.num - bParts.num;
};

function generateExercises() {
  const timeSlots = fs.readdirSync(config.videoRoot).filter(f =>
    fs.statSync(path.join(config.videoRoot, f)).isDirectory()
  );

  const exercisesData = {};

  timeSlots.forEach(timeSlot => {
    const dirPath = path.join(config.videoRoot, timeSlot);

    // 读取并严格排序文件
    const files = fs.readdirSync(dirPath)
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.mp4', '.mov', '.avi'].includes(ext);
      })
      .sort(naturalCompare);  // 使用增强排序

    // 生成带连续序号的数据
    exercisesData[timeSlot] = files.map((file, index) => {
      const baseName = path.basename(file, path.extname(file));
      const match = baseName.match(config.nameRules.pattern);

      let displayName = '';
      let fileNumber = '';

      if (match) {
        const [, namePart, numPart] = match;
        displayName = namePart.trim().replace(/_/g, ' ');
        fileNumber = numPart;
      } else {
        displayName = baseName.replace(/_/g, ' ');
      }

      return {
        name: `${index + 1}. ${config.nameRules.replacements[timeSlot]}${displayName}${fileNumber ? ` ${fileNumber}` : ''}`,
        duration: config.durationMap[timeSlot] || "默认时长",
        video: `/videos/${timeSlot}/${file}`,
        type: config.defaultType
      };
    });
  });

  const jsContent = `// 该文件由脚本自动生成，请勿手动修改
export const exercises = ${JSON.stringify(exercisesData, null, 2)
  .replace(/"([^"]+)":/g, '$1:')
  .replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, code) =>
    String.fromCodePoint(parseInt(code, 16)))};
`;

  fs.writeFileSync(config.outputFile, jsContent);
  console.log('✅ exercises.js 已自动生成');
}

// 执行生成
try {
  generateExercises();
} catch (error) {
  console.error('❌ 生成失败:', error.message);
  process.exit(1);
}
