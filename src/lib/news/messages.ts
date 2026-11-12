export const newsMessages = {
  en: { heading: 'Latest posts', published: 'Published', by: 'by', back: 'Back to News', empty: 'No posts yet.' },
  'pt-br': { heading: 'Últimas notícias', published: 'Publicado em', by: 'por', back: 'Voltar para notícias', empty: 'Ainda não há publicações.' },
  'pt-pt': { heading: 'Últimas notícias', published: 'Publicado em', by: 'por', back: 'Voltar às notícias', empty: 'Ainda não há publicações.' },
  es: { heading: 'Últimas noticias', published: 'Publicado el', by: 'por', back: 'Volver a noticias', empty: 'Todavía no hay publicaciones.' },
  fr: { heading: 'Dernières actualités', published: 'Publié le', by: 'par', back: 'Retour aux actualités', empty: 'Aucune publication pour le moment.' },
  it: { heading: 'Ultime notizie', published: 'Pubblicato il', by: 'di', back: 'Torna alle notizie', empty: 'Non ci sono ancora articoli.' },
  zh: { heading: '最新消息', published: '发布日期', by: '作者', back: '返回新闻', empty: '暂时还没有文章。' },
  ja: { heading: '最新ニュース', published: '公開日', by: '著者', back: 'ニュース一覧に戻る', empty: '記事はまだありません。' },
  de: { heading: 'Neueste Beiträge', published: 'Veröffentlicht am', by: 'von', back: 'Zurück zu den Neuigkeiten', empty: 'Es gibt noch keine Beiträge.' },
  ru: { heading: 'Последние новости', published: 'Опубликовано', by: 'Автор:', back: 'Вернуться к новостям', empty: 'Публикаций пока нет.' },
  ko: { heading: '최신 소식', published: '게시일', by: '작성자', back: '뉴스로 돌아가기', empty: '아직 게시물이 없습니다.' },
  hi: { heading: 'ताज़ा ख़बरें', published: 'प्रकाशित', by: 'द्वारा', back: 'ख़बरों पर वापस जाएँ', empty: 'अभी कोई पोस्ट नहीं है।' },
  ar: { heading: 'آخر الأخبار', published: 'نُشر في', by: 'بقلم', back: 'العودة إلى الأخبار', empty: 'لا توجد منشورات بعد.' },
  bn: { heading: 'সর্বশেষ খবর', published: 'প্রকাশিত', by: 'লিখেছেন', back: 'খবরে ফিরে যান', empty: 'এখনও কোনো পোস্ট নেই।' },
  id: { heading: 'Berita terbaru', published: 'Diterbitkan', by: 'oleh', back: 'Kembali ke Berita', empty: 'Belum ada artikel.' },
  ur: { heading: 'تازہ ترین خبریں', published: 'شائع شدہ', by: 'تحریر', back: 'خبروں پر واپس جائیں', empty: 'ابھی کوئی پوسٹ نہیں ہے۔' },
  vi: { heading: 'Tin mới nhất', published: 'Ngày đăng', by: 'bởi', back: 'Quay lại Tin tức', empty: 'Chưa có bài viết nào.' },
  tr: { heading: 'Son haberler', published: 'Yayın tarihi', by: 'yazan', back: 'Haberlere dön', empty: 'Henüz yazı yok.' },
} as const

export type NewsLocale = keyof typeof newsMessages
