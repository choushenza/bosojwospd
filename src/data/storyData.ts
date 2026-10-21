export interface StoryParagraph {
  id: number;
  jawa: string;
  latin: string;
  indonesian: string;
  keywords: string[];
  vocabulary: {
    jawa: string;
    latin: string;
    meaning: string;
  }[];
}

export interface StoryData {
  titleJawa: string;
  titleLatin: string;
  titleIndo: string;
  author: string;
  description: string;
  paragraphs: StoryParagraph[];
}

export const STORY_DATA: StoryData = {
  titleJawa: 'ꦢꦺꦴꦭꦤ꧀ ꦩꦼꦚꦁ ꦢꦭꦼꦩꦺ ꦱꦶꦩ꧀ꦧꦃ',
  titleLatin: 'Dolan Menyang Daleme Simbah',
  titleIndo: 'Berkunjung ke Rumah Kakek dan Nenek',
  author: 'Wacan Bocah Kelas 5 SD',
  description: 'Wacan cerita basa Jawa kanthi aksara Jawa 3 paragraf. Siswa saged gladhen nerjemahake menyang basa Indonesia utawa latin.',
  paragraphs: [
    {
      id: 1,
      jawa: 'ꦤꦭꦶꦏ ꦢꦶꦤ ꦩꦶꦁꦒꦸ ꦲꦶꦧꦸ ꦭꦤ꧀ ꦧꦥꦏ꧀ ꦔꦗꦏ꧀ ꦢꦺꦴꦭꦤ꧀ ꦩꦼꦚꦁ ꦢꦭꦼꦩꦺ ꦱꦶꦩ꧀ꦧꦃ꧉ ꦱꦶꦩ꧀ꦧꦃ ꦢꦸꦩꦸꦤꦸꦁ ꦲꦤ ꦲꦶꦁ ꦢꦺꦱ ꦱꦶꦁ ꦲꦱꦿꦶ ꦭꦤ꧀ ꦲꦢꦼꦩ꧀꧉',
      latin: 'Nalika dina Minggu, ibu lan bapak ngajak dolan menyang daleme simbah. Simbah dumunung ana ing desa sing asri lan adem.',
      indonesian: 'Ketika hari Minggu, ibu dan bapak mengajak bermain ke rumah simbah (kakek/nenek). Simbah bertempat tinggal di desa yang asri dan sejuk.',
      keywords: ['minggu', 'ibu', 'bapak', 'dolan', 'simbah', 'desa', 'asri', 'adem', 'sejuk', 'rumah'],
      vocabulary: [
        { jawa: 'ꦤꦭꦶꦏ', latin: 'nalika', meaning: 'ketika / saat' },
        { jawa: 'ꦢꦶꦤ ꦩꦶꦁꦒꦸ', latin: 'dina Minggu', meaning: 'hari Minggu' },
        { jawa: 'ꦢꦺꦴꦭꦤ꧀', latin: 'dolan', meaning: 'bermain / berkunjung' },
        { jawa: 'ꦢꦭꦼꦩꦺ', latin: 'daleme', meaning: 'rumahnya (krama halus)' },
        { jawa: 'ꦱꦶꦩ꧀ꦧꦃ', latin: 'simbah', meaning: 'kakek / nenek' },
        { jawa: 'ꦢꦸꦩꦸꦤꦸꦁ', latin: 'dumunung', meaning: 'bertempat tinggal / beralamat' },
        { jawa: 'ꦲꦢꦼꦩ꧀', latin: 'adem', meaning: 'sejuk / dingin nyaman' }
      ]
    },
    {
      id: 2,
      jawa: 'ꦲꦶꦁ ꦱꦮꦃ ꦲꦏꦺꦃ ꦥꦫ ꦠꦤꦶ ꦥꦝ ꦤꦤ꧀ꦢꦸꦂ ꦥꦫꦶ ꦭꦤ꧀ ꦏꦕꦁ꧉ ꦲꦸꦒ ꦲꦤ ꦩꦤꦸꦏ꧀ ꦱꦶꦁ ꦩꦧꦸꦂ ꦲꦶꦁ ꦔꦮꦁ ꦲꦮꦁ ꦏꦤ꧀ꦛꦶ ꦱꦼꦤꦼꦁ꧉',
      latin: 'Ing sawah akeh para tani padha nandur pari lan kacang. Uga ana manuk sing mabur ing ngawang-awang kanthi seneng.',
      indonesian: 'Di sawah banyak para petani menanam padi dan kacang. Ada juga burung yang terbang di angkasa dengan gembira.',
      keywords: ['sawah', 'petani', 'tani', 'nandur', 'padi', 'pari', 'kacang', 'burung', 'manuk', 'terbang', 'senang', 'gembira'],
      vocabulary: [
        { jawa: 'ꦱꦮꦃ', latin: 'sawah', meaning: 'sawah' },
        { jawa: 'ꦲꦏꦺꦃ', latin: 'akeh', meaning: 'banyak' },
        { jawa: 'ꦤꦤ꧀ꦢꦸꦂ', latin: 'nandur', meaning: 'menanam bibit' },
        { jawa: 'ꦥꦫꦶ', latin: 'pari', meaning: 'tanaman padi' },
        { jawa: 'ꦩꦤꦸꦏ꧀', latin: 'manuk', meaning: 'burung' },
        { jawa: 'ꦩꦧꦸꦂ', latin: 'mabur', meaning: 'terbang' },
        { jawa: 'ꦔꦮꦁ ꦲꦮꦁ', latin: 'ngawang-awang', meaning: 'angkasa / langit' },
        { jawa: 'ꦱꦼꦤꦼꦁ', latin: 'seneng', meaning: 'senang / gembira' }
      ]
    },
    {
      id: 3,
      jawa: 'ꦱꦶꦩ꧀ꦧꦃ ꦩꦱꦏ꧀ ꦱꦼꦒ ꦲꦔꦼꦠ꧀ ꦭꦤ꧀ ꦱꦠꦺ ꦏꦁꦒꦺꦴ ꦱꦫꦥꦤ꧀꧉ ꦏꦧꦺꦃ ꦥꦝ ꦩꦔꦤ꧀ ꦏꦤ꧀ꦛꦶ ꦒꦪꦼꦁ ꦭꦤ꧀ ꦱꦸꦏ ꦥꦫꦶꦱꦸꦏ꧉',
      latin: 'Simbah masak sega anget lan sate kanggo sarapan. Kabeh padha mangan kanthi gayeng lan suka parisuka.',
      indonesian: 'Simbah memasak nasi hangat dan sate untuk sarapan. Semua makan bersama dengan rukun dan penuh kegembiraan.',
      keywords: ['simbah', 'masak', 'nasi', 'sega', 'hangat', 'anget', 'sate', 'sarapan', 'mangan', 'makan', 'senang', 'rukun'],
      vocabulary: [
        { jawa: 'ꦩꦱꦏ꧀', latin: 'masak', meaning: 'memasak' },
        { jawa: 'ꦱꦼꦒ ꦲꦔꦼꦠ꧀', latin: 'sega anget', meaning: 'nasi hangat' },
        { jawa: 'ꦱꦠꦺ', latin: 'sate', meaning: 'sate' },
        { jawa: 'ꦱꦫꦥꦤ꧀', latin: 'sarapan', meaning: 'makan pagi / sarapan' },
        { jawa: 'ꦩꦔꦤ꧀', latin: 'mangan', meaning: 'makan' },
        { jawa: 'ꦒꦪꦼꦁ', latin: 'gayeng', meaning: 'hangat / akrab / rukun' },
        { jawa: 'ꦱꦸꦏ ꦥꦫꦶꦱꦸꦏ', latin: 'suka parisuka', meaning: 'penuh kegembiraan' }
      ]
    }
  ]
};
