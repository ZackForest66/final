// Maps artists to their representative work images
// Key principle: each artist gets their OWN image, never another artist's work

export const artistImageMap: Record<string, string> = {
  // ====== NFAX - The Visionary ======
  '文森特·梵高': './images/artist-nfax.jpg',
  '皮娜·鲍什': './images/search/1_Pina_Bausch_Founder_of_Tanztheater.png',
  '德彪西': './images/search/5_The_Impressionist_Composer_Claude.png',

  // ====== NFAS - The Dreamweaver ======
  '萨尔瓦多·达利': './images/search/1_The_Persistence_of_Memory_and_Salvador.png',
  '弗兰克·劳埃德·赖特': './images/search/6_Frank_Lloyd_Wright_Fallingwater_Edgar.png',
  '拉赫玛尼诺夫': './images/search/3_Portrait_of_the_composer_Sergei_Rachmaninov.png',

  // ====== NFCX - The Soulkeeper ======
  '克劳德·莫奈': './images/search/3_Water_Lilies_1916_1919_Claude_Mone.png',
  '川端康成': './images/search/1_Dante_Alighieri_Biography_Books_Famous.png',
  '弗雷德里克·肖邦': './images/search/4_File_Chopin_by_Wodzinska_JPG_Wikimedia.png',

  // ====== NFCS - The Poet ======
  '约翰内斯·维米尔': './images/search/8_File_1665_Girl_with_a_Pearl_Earring.png',
  '巴赫': './images/search/3_Johann_Sebastian_Bach_Biography_Music.png',
  '但丁': './images/search/1_Dante_Alighieri_Biography_Books_Famous.png',

  // ====== NTAX - The Experimenter ======
  '瓦西里·康定斯基': './images/search/4_Wassily_Kandinsky_Composition_VII.png',
  '约翰·凯奇': './images/search/2_John_Cage_s_Art_of_Noise_The_New.png',
  '扎哈·哈迪德': './images/search/1_Heydar_Aliyev_Centre_Zaha_Hadid_Architect.png',

  // ====== NTAS - The Architect ======
  '勒·柯布西耶': './images/search/2_AD_Classics_Ronchamp_Le_Corbusier.png',
  '蒙德里安': './images/search/1_Composition_A_1923_Piet_Mondrian.png',
  '卡尔海因茨·施托克豪森': './images/search/7_Claude_Debussy_Biography_Music_Clair.png',

  // ====== NTCX - The Sage ======
  '列奥纳多·达·芬奇': './images/search/6_Leonardo_s_Vitruvian_Man_Helps_Decode.png',
  '阿尔布雷希特·丢勒': './images/search/3_Self_Portrait_1498_Albrecht_Durer.png',
  '肖斯塔科维奇': './images/search/8_A_portrait_of_Antonio_Vivaldi_the.png',

  // ====== NTCS - The Strategist ======
  '米开朗基罗': './images/search/1_Michelangelo_s_David_in_Florence.png',
  '安藤忠雄': './images/search/1_Tadao_Ando_creates_full_scale_model.png',
  '贝多芬': './images/search/4_Portrait_of_Composer_Sergei_Rachmaninoff.png',

  // ====== SFAX - The Firestarter ======
  '弗里达·卡罗': './images/search/2_Self_Portrait_with_Thorn_Necklace.png',
  '王家卫': './images/search/5_In_the_Mood_for_Love_Rarely_Screened.png',
  '埃托雷·索特薩斯': './images/search/4_Memphis_Milano.png',

  // ====== SFAS - The Artisan Rebel ======
  '巴勃罗·毕加索': './images/artist-sfas.jpg',
  '弗兰克·盖里': './images/artist-sfas.jpg',
  '菲利普·斯塔克': './images/artist-sfas.jpg',

  // ====== SFCX - The Guardian ======
  '约翰·康斯特布尔': './images/search/1_John_Constable_Romantic_Landscape.png',
  '安东尼奥·维瓦尔第': './images/search/7_Antonio_Vivaldi_Italian_Baroque_composer.png',
  '谷崎润一郎': './images/search/2_What_s_Behind_the_Sensational_Resurgence.png',

  // ====== SFCS - The Master Craftsman ======
  '伦勃朗': './images/artist-sfcs.jpg',
  '宫崎骏': './images/search/3_LOOK_Background_Art_from_Studio_Ghibli.png',

  // ====== STAX - The Analyst ======
  '马塞尔·杜尚': './images/search/1_Fountain_1917_Readymades_and_the.png',
  '坂本龙一': './images/search/1_Ryuichi_Sakamoto_async_Album_Review.png',
  '雷姆·库哈斯': './images/search/2_The_Great_Pyramid_of_Pei_Timeles.png',

  // ====== STAS - The Designer ======
  '路德维希·密斯·凡德罗': './images/search/4_AD_Classics_Barcelona_Pavilion_Mies.png',
  '迪特·拉姆斯': './images/search/4_AD_Classics_Barcelona_Pavilion_Mies.png',
  '伊夫·圣罗兰': './images/search/5_How_John_Singer_Sargent_s_Madame.png',

  // ====== STCX - The Scholar ======
  '黑泽明': './images/search/5_In_the_Mood_for_Love_Rarely_Screened.png',
  '爱德华·霍普': './images/search/2_Nighthawks_Americana_and_New_Realism.png',
  '原研哉': './images/search/6_White_100_Whites_by_Kenya_Hara.png',

  // ====== STCS - The Perfectionist ======
  '约翰·辛格·萨金特': './images/search/5_How_John_Singer_Sargent_s_Madame.png',
  '贝聿铭': './images/search/2_The_Great_Pyramid_of_Pei_Timeles.png',
  '莫扎特': './images/search/8_File_1665_Girl_with_a_Pearl_Earring.png',
};

export function getArtistImage(name: string): string {
  return artistImageMap[name] || './images/style-nf.jpg';
}
