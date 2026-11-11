export const newsMessages = {
  en: { heading: 'Latest posts', published: 'Published', back: 'Back to News', empty: 'No posts yet.' },
  'pt-br': { heading: 'Últimas notícias', published: 'Publicado em', back: 'Voltar para notícias', empty: 'Ainda não há publicações.' },
  'pt-pt': { heading: 'Últimas notícias', published: 'Publicado em', back: 'Voltar às notícias', empty: 'Ainda não há publicações.' },
  es: { heading: 'Últimas noticias', published: 'Publicado el', back: 'Volver a noticias', empty: 'Todavía no hay publicaciones.' },
  fr: { heading: 'Dernières actualités', published: 'Publié le', back: 'Retour aux actualités', empty: 'Aucune publication pour le moment.' },
  it: { heading: 'Ultime notizie', published: 'Pubblicato il', back: 'Torna alle notizie', empty: 'Non ci sono ancora articoli.' },
  zh: { heading: '最新消息', published: '发布日期', back: '返回新闻', empty: '暂时还没有文章。' },
  ja: { heading: '最新ニュース', published: '公開日', back: 'ニュース一覧に戻る', empty: '記事はまだありません。' },
  de: { heading: 'Neueste Beiträge', published: 'Veröffentlicht am', back: 'Zurück zu den Neuigkeiten', empty: 'Es gibt noch keine Beiträge.' },
  ru: { heading: 'Последние новости', published: 'Опубликовано', back: 'Вернуться к новостям', empty: 'Публикаций пока нет.' },
  ko: { heading: '최신 소식', published: '게시일', back: '뉴스로 돌아가기', empty: '아직 게시물이 없습니다.' },
  hi: { heading: 'ताज़ा ख़बरें', published: 'प्रकाशित', back: 'ख़बरों पर वापस जाएँ', empty: 'अभी कोई पोस्ट नहीं है।' },
  ar: { heading: 'آخر الأخبار', published: 'نُشر في', back: 'العودة إلى الأخبار', empty: 'لا توجد منشورات بعد.' },
  bn: { heading: 'সর্বশেষ খবর', published: 'প্রকাশিত', back: 'খবরে ফিরে যান', empty: 'এখনও কোনো পোস্ট নেই।' },
  id: { heading: 'Berita terbaru', published: 'Diterbitkan', back: 'Kembali ke Berita', empty: 'Belum ada artikel.' },
  ur: { heading: 'تازہ ترین خبریں', published: 'شائع شدہ', back: 'خبروں پر واپس جائیں', empty: 'ابھی کوئی پوسٹ نہیں ہے۔' },
  vi: { heading: 'Tin mới nhất', published: 'Ngày đăng', back: 'Quay lại Tin tức', empty: 'Chưa có bài viết nào.' },
  tr: { heading: 'Son haberler', published: 'Yayın tarihi', back: 'Haberlere dön', empty: 'Henüz yazı yok.' },
} as const

export type NewsLocale = keyof typeof newsMessages
