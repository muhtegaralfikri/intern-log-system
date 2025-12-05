import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }
  }

  async summarizeActivities(activities: any[]): Promise<string> {
    if (!this.model) {
      return this.fallbackSummary(activities);
    }

    const activitiesText = activities
      .map(
        (a) =>
          `- ${a.date}: ${a.title} (${a.category}, ${a.duration} menit) - ${a.description}`,
      )
      .join('\n');

    const prompt = `
Buatkan ringkasan laporan aktivitas magang berikut dalam bahasa Indonesia yang profesional.
Format: paragraf ringkas yang mencakup poin-poin utama kegiatan.

Aktivitas:
${activitiesText}

Ringkasan:`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('AI Summary error:', error);
      return this.fallbackSummary(activities);
    }
  }

  async generateWeeklyReport(
    activities: any[],
    startDate: Date,
    endDate: Date,
  ): Promise<string> {
    if (!this.model) {
      return this.fallbackWeeklyReport(activities, startDate, endDate);
    }

    const totalMinutes = activities.reduce((sum, a) => sum + a.duration, 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    const categories = [...new Set(activities.map((a) => a.category))];

    const activitiesText = activities
      .map(
        (a) =>
          `- ${new Date(a.date).toLocaleDateString('id-ID')}: ${a.title} (${a.category}, ${a.duration} menit)\n  Deskripsi: ${a.description}`,
      )
      .join('\n');

    const prompt = `
Buatkan laporan mingguan magang dalam bahasa Indonesia yang profesional, ringkas, dan siap pakai.
JANGAN gunakan placeholder seperti [Nama], [Divisi], dll. Langsung tulis konten laporan.

Periode: ${startDate.toLocaleDateString('id-ID')} - ${endDate.toLocaleDateString('id-ID')}
Total Aktivitas: ${activities.length} kegiatan
Total Waktu: ${totalHours} jam ${remainingMinutes} menit
Kategori: ${categories.join(', ')}

Aktivitas yang dilakukan:
${activitiesText || 'Tidak ada aktivitas tercatat pada periode ini.'}

Format laporan (gunakan format markdown yang bersih):

# Laporan Mingguan
**Periode: ${startDate.toLocaleDateString('id-ID')} - ${endDate.toLocaleDateString('id-ID')}**

## Ringkasan
(Tulis 2-3 kalimat ringkasan kegiatan minggu ini berdasarkan data aktivitas di atas)

## Kegiatan yang Dilakukan
(List kegiatan dalam bullet points berdasarkan data di atas, kelompokkan per kategori jika perlu)

## Pencapaian
(List pencapaian/output yang dihasilkan)

## Total Waktu Kerja
- Total: ${totalHours} jam ${remainingMinutes} menit
- Jumlah Aktivitas: ${activities.length}

## Catatan & Rencana
(Berikan insight singkat dan rencana untuk minggu depan)

Tulis laporan langsung tanpa placeholder:`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('AI Weekly Report error:', error);
      return this.fallbackWeeklyReport(activities, startDate, endDate);
    }
  }

  async suggestTasks(
    userSkills: any[],
    recentActivities: any[],
  ): Promise<string[]> {
    if (!this.model) {
      return this.fallbackSuggestions();
    }

    const skillsText = userSkills
      .map((s) => `${s.skill.name} (Level: ${s.level})`)
      .join(', ');
    const recentText = recentActivities
      .slice(0, 5)
      .map((a) => a.title)
      .join(', ');

    const prompt = `
Berdasarkan skill dan aktivitas terbaru intern berikut, sarankan 3-5 task untuk pengembangan skill.

Skills: ${skillsText || 'Belum ada data skill'}
Aktivitas terbaru: ${recentText || 'Belum ada aktivitas'}

Berikan saran dalam format JSON array string, contoh: ["Saran 1", "Saran 2", "Saran 3"]
Hanya output JSON array, tanpa penjelasan tambahan.`;

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\[.*\]/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return this.fallbackSuggestions();
    } catch (error) {
      console.error('AI Suggest error:', error);
      return this.fallbackSuggestions();
    }
  }

  async getDailyPrompts(): Promise<string[]> {
    const defaultPrompts = [
      'Apa task utama yang kamu kerjakan hari ini?',
      'Apakah ada meeting atau diskusi penting?',
      'Skill baru apa yang kamu pelajari?',
      'Apakah ada kendala yang kamu hadapi?',
      'Apa yang ingin kamu capai besok?',
    ];

    if (!this.model) {
      return defaultPrompts;
    }

    const today = new Date();
    const dayName = today.toLocaleDateString('id-ID', { weekday: 'long' });

    const prompt = `
Hari ini adalah ${dayName}. Berikan 5 pertanyaan refleksi harian untuk intern dalam bahasa Indonesia.
Pertanyaan harus membantu intern mendokumentasikan aktivitas dengan baik.

Format output: JSON array string, contoh: ["Pertanyaan 1", "Pertanyaan 2"]
Hanya output JSON array.`;

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\[.*\]/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return defaultPrompts;
    } catch {
      return defaultPrompts;
    }
  }

  async generateReflectionQuestions(activities: any[]): Promise<string[]> {
    const defaultQuestions = [
      'Apa pencapaian terbesar minggu ini?',
      'Apa tantangan terbesar yang kamu hadapi?',
      'Apa yang ingin kamu pelajari minggu depan?',
      'Bagaimana perasaanmu tentang progress magang sejauh ini?',
    ];

    if (!this.model || activities.length === 0) {
      return defaultQuestions;
    }

    const categories = [...new Set(activities.map((a) => a.category))];

    const prompt = `
Intern telah melakukan aktivitas dengan kategori: ${categories.join(', ')}
Berikan 4-5 pertanyaan refleksi mingguan yang relevan dalam bahasa Indonesia.

Format: JSON array string
Hanya output JSON array.`;

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\[.*\]/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return defaultQuestions;
    } catch {
      return defaultQuestions;
    }
  }

  private fallbackSummary(activities: any[]): string {
    const totalMinutes = activities.reduce((sum, a) => sum + a.duration, 0);
    const hours = Math.floor(totalMinutes / 60);
    const categories = [...new Set(activities.map((a) => a.category))];

    return `Selama periode ini, telah dilakukan ${activities.length} aktivitas dengan total waktu ${hours} jam ${totalMinutes % 60} menit. Kategori kegiatan meliputi: ${categories.join(', ')}.`;
  }

  private fallbackWeeklyReport(
    activities: any[],
    startDate: Date,
    endDate: Date,
  ): string {
    const totalMinutes = activities.reduce((sum, a) => sum + a.duration, 0);
    const categories = [...new Set(activities.map((a) => a.category))];

    return `
## Laporan Mingguan
Periode: ${startDate.toLocaleDateString('id-ID')} - ${endDate.toLocaleDateString('id-ID')}

### Ringkasan
Total ${activities.length} aktivitas telah dilakukan dengan total waktu ${Math.floor(totalMinutes / 60)} jam.

### Kategori Kegiatan
${categories.map((c) => `- ${c}`).join('\n')}

### Daftar Aktivitas
${activities.map((a) => `- ${a.title}: ${a.description}`).join('\n')}
    `.trim();
  }

  private fallbackSuggestions(): string[] {
    return [
      'Pelajari dokumentasi framework yang sedang digunakan',
      'Review dan refactor code yang sudah dibuat',
      'Buat unit test untuk fitur yang sudah selesai',
      'Diskusikan progress dengan supervisor',
      'Eksplorasi fitur baru yang bisa ditambahkan',
    ];
  }
}
