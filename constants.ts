
import { ConsoleModel, ConsoleType, Game, PerformanceTier, Tournament, TournamentStatus, LeaderboardEntry } from './types';

// High quality gaming-related images from Unsplash and placehold.co for specific branding
export const GAMES: Game[] = [
  // --- Modern / High Fidelity ---
  {
    id: 'g1',
    title: 'Cyber Odyssey 2077',
    genre: 'RPG',
    coverUrl: 'https://images.unsplash.com/photo-1614741487319-f943939846af?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2023,
    rating: 4.8,
    description: 'A futuristic open-world RPG with stunning ray-tracing capabilities.'
  },
  {
    id: 'g4',
    title: 'Elden Souls',
    genre: 'Action RPG',
    coverUrl: 'https://images.unsplash.com/photo-1610041321327-b794c052db27?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2022,
    rating: 4.9,
    description: 'Challenging combat in a dark fantasy world.'
  },
  {
    id: 'g11',
    title: 'Web Slinger PS4',
    genre: 'Action',
    coverUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2018,
    rating: 4.8,
    description: 'Swing through the city in high definition.'
  },
  {
    id: 'g40',
    title: 'God of War: Ragnarok',
    genre: 'Action Adventure',
    coverUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2022,
    rating: 4.9,
    description: 'Kratos and Atreus embark on a mythic journey for answers.'
  },
  
  // --- CALL OF DUTY SERIES ---
  {
    id: 'cod_classic',
    title: 'Call of Duty: Classic',
    genre: 'First-Person Shooter',
    coverUrl: 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2003,
    rating: 4.5,
    description: 'The game that started the legendary cinematic war experience.'
  },
  {
    id: 'cod2',
    title: 'Call of Duty 2',
    genre: 'First-Person Shooter',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2005,
    rating: 4.8,
    description: 'Intense WWII action through the eyes of Allied soldiers.'
  },
  {
    id: 'cod4_mw',
    title: 'Call of Duty 4: Modern Warfare',
    genre: 'First-Person Shooter',
    coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2007,
    rating: 4.9,
    description: 'The definitive modern shooter that changed multiplayer forever.'
  },
  {
    id: 'cod_waw',
    title: 'Call of Duty: World at War',
    genre: 'First-Person Shooter',
    coverUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2008,
    rating: 4.7,
    description: 'Gritty WWII combat and the birthplace of the Zombies mode.'
  },
  {
    id: 'cod_mw2_2009',
    title: 'Call of Duty: Modern Warfare 2 (2009)',
    genre: 'First-Person Shooter',
    coverUrl: 'https://images.unsplash.com/photo-1614741487319-f943939846af?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2009,
    rating: 5.0,
    description: 'The peak of the original Modern Warfare trilogy.'
  },
  {
    id: 'cod_bo',
    title: 'Call of Duty: Black Ops',
    genre: 'First-Person Shooter',
    coverUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2010,
    rating: 4.9,
    description: 'A cold war thriller filled with shadows and betrayal.'
  },
  {
    id: 'cod_bo2',
    title: 'Call of Duty: Black Ops II',
    genre: 'First-Person Shooter',
    coverUrl: 'https://images.unsplash.com/photo-1610041321327-b794c052db27?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2012,
    rating: 4.8,
    description: 'Near-future warfare with branching storylines.'
  },
  {
    id: 'cod_mw_2019',
    title: 'Call of Duty: Modern Warfare (2019)',
    genre: 'First-Person Shooter',
    coverUrl: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2019,
    rating: 4.7,
    description: 'A gritty, realistic reboot of the Modern Warfare series.'
  },
  {
    id: 'cod_warzone',
    title: 'Call of Duty: Warzone',
    genre: 'First-Person Shooter',
    coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2020,
    rating: 4.6,
    description: 'Massive battle royale action in the Call of Duty universe.'
  },
  {
    id: 'cod_mw3_2023',
    title: 'Call of Duty: Modern Warfare III',
    genre: 'First-Person Shooter',
    coverUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2023,
    rating: 4.5,
    description: 'The latest chapter in Task Force 141’s fight against Makarov.'
  },

  {
    id: 'g41',
    title: 'The Witcher 3: Wild Hunt',
    genre: 'RPG',
    coverUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2015,
    rating: 4.9,
    description: 'A story-driven open world RPG set in a visually stunning fantasy universe.'
  },
  {
    id: 'g42',
    title: 'Fortnite',
    genre: 'Battle Royale',
    coverUrl: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2017,
    rating: 4.5,
    description: 'The battle royale phenomenon. Build, battle, and survive.'
  },
  {
    id: 'g43',
    title: 'Apex Legends',
    genre: 'Battle Royale',
    coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2019,
    rating: 4.7,
    description: 'Strategic squad-based shooter with unique legends.'
  },
  
  // --- Modern Sports ---
  {
    id: 'g_gt7',
    title: 'Gran Turismo 7',
    genre: 'Racing',
    coverUrl: 'https://images.unsplash.com/photo-1547919307-1ecb10702e6f?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2022,
    rating: 4.7,
    description: 'The latest iteration of the legendary driving simulator.'
  },
  {
    id: 'g_fc24',
    title: 'EA Sports FC 24',
    genre: 'Sports',
    coverUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2023,
    rating: 4.6,
    description: 'The new era of The Worlds Game with HyperMotionV.'
  },

  // --- NES (Nintendo Entertainment System) ---
  {
    id: 'g2',
    title: 'Plumber Bros. 3',
    genre: 'Platformer',
    coverUrl: 'https://images.unsplash.com/photo-1612404730960-5c71579fca11?auto=format&fit=crop&w=600&q=80',
    releaseYear: 1990,
    rating: 5.0,
    description: 'The classic 8-bit platformer that defined a generation.'
  },
  {
    id: 'g38',
    title: 'The Legend of Zelda',
    genre: 'Action Adventure',
    coverUrl: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?auto=format&fit=crop&w=600&q=80',
    releaseYear: 1986,
    rating: 4.8,
    description: 'The fantasy adventure that started it all.'
  },
  {
    id: 'g39',
    title: 'Metroid',
    genre: 'Action Adventure',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    releaseYear: 1986,
    rating: 4.6,
    description: 'Explore the depths of planet Zebes as Samus Aran.'
  },

  // --- SNES (Super Nintendo) ---
  {
    id: 'g5',
    title: 'Super Plumber World',
    genre: 'Platformer',
    coverUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=600&q=80',
    releaseYear: 1991,
    rating: 4.9,
    description: 'The 16-bit sequel that introduced the dinosaur companion.'
  },
  {
    id: 'g36',
    title: 'Chrono Trigger',
    genre: 'RPG',
    coverUrl: 'https://images.unsplash.com/photo-1635697860804-e62b5a397bf5?auto=format&fit=crop&w=600&q=80',
    releaseYear: 1995,
    rating: 5.0,
    description: 'Time-traveling RPG masterpiece with multiple endings.'
  },
  {
    id: 'g37',
    title: 'Street Fighter II Turbo',
    genre: 'Fighting',
    coverUrl: 'https://images.unsplash.com/photo-1551430064-77c5d730df85?auto=format&fit=crop&w=600&q=80',
    releaseYear: 1992,
    rating: 4.8,
    description: 'The definitive version of the fighting game phenomenon.'
  },
  {
    id: 'g_nbajam',
    title: 'NBA Jam',
    genre: 'Sports',
    coverUrl: 'https://images.unsplash.com/photo-1519861531473-9200263931a2?auto=format&fit=crop&w=600&q=80',
    releaseYear: 1993,
    rating: 4.8,
    description: 'He is on fire! Arcade basketball at its finest.'
  },

  // --- N64 (Nintendo 64) ---
  {
    id: 'g3',
    title: 'Kart Racer 64',
    genre: 'Racing',
    coverUrl: 'https://images.unsplash.com/photo-1552065993-36cb15084b1e?auto=format&fit=crop&w=600&q=80',
    releaseYear: 1996,
    rating: 4.7,
    description: 'Chaotic racing action with friends.'
  },
  {
    id: 'g15',
    title: 'GoldenEye 007',
    genre: 'FPS',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    releaseYear: 1997,
    rating: 4.9,
    description: 'The seminal split-screen shooter that defined multiplayer.'
  },
  {
    id: 'g16',
    title: 'The Legend of Zelda: Ocarina of Time',
    genre: 'Action Adventure',
    coverUrl: 'https://images.unsplash.com/photo-1558435186-d31d1408e9eb?auto=format&fit=crop&w=600&q=80',
    releaseYear: 1998,
    rating: 5.0,
    description: 'An epic 3D quest through time to stop the King of Thieves.'
  },
  {
    id: 'g17',
    title: 'Super Smash Bros.',
    genre: 'Fighting',
    coverUrl: 'https://images.unsplash.com/photo-1629814129777-339d27b7a41d?auto=format&fit=crop&w=600&q=80',
    releaseYear: 1999,
    rating: 4.8,
    description: 'Nintendo mascots duke it out in this platform fighter.'
  },
  {
    id: 'g_fifa98',
    title: 'FIFA: Road to World Cup 98',
    genre: 'Sports',
    coverUrl: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=600&q=80',
    releaseYear: 1997,
    rating: 4.5,
    description: 'Classic football with the iconic indoor stadium mode.'
  },

  // --- Sega Genesis ---
  {
    id: 'g7',
    title: 'Fastest Hedgehog 2',
    genre: 'Platformer',
    coverUrl: 'https://images.unsplash.com/photo-1560946953-ebf55f5d9785?auto=format&fit=crop&w=600&q=80',
    releaseYear: 1992,
    rating: 4.6,
    description: 'Gotta go fast in this 16-bit classic.'
  },
  {
    id: 'g44',
    title: 'Streets of Rage 2',
    genre: 'Beat \'em up',
    coverUrl: 'https://images.unsplash.com/photo-1573053350776-98d2549e8611?auto=format&fit=crop&w=600&q=80',
    releaseYear: 1992,
    rating: 4.8,
    description: 'Side-scrolling brawl with an iconic electronic soundtrack.'
  },

  // --- Sega Dreamcast ---
  {
    id: 'g30',
    title: 'Sonic Adventure 2',
    genre: 'Platformer',
    coverUrl: 'https://images.unsplash.com/photo-1623071325553-05225387288a?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2001,
    rating: 4.7,
    description: 'High-speed 3D platforming with hero and dark storylines.'
  },
  {
    id: 'g31',
    title: 'Crazy Taxi',
    genre: 'Arcade Racing',
    coverUrl: 'https://images.unsplash.com/photo-1526550517342-e086b387edda?auto=format&fit=crop&w=600&q=80',
    releaseYear: 1999,
    rating: 4.6,
    description: 'Arcade driving madness. Make some crazy money!'
  },
  {
    id: 'g45',
    title: 'SoulCalibur',
    genre: 'Fighting',
    coverUrl: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=600&q=80',
    releaseYear: 1999,
    rating: 4.9,
    description: 'Weapon-based fighting game that set visual benchmarks.'
  },

  // --- PS1 (PlayStation) ---
  {
    id: 'g6',
    title: 'Tactical Espionage Action',
    genre: 'Stealth',
    coverUrl: 'https://images.unsplash.com/photo-1530825985265-b64b1b836476?auto=format&fit=crop&w=600&q=80',
    releaseYear: 1998,
    rating: 4.8,
    description: 'Cinematic stealth action that changed gaming forever.'
  },
  {
    id: 'g18',
    title: 'Final Fantasy VII',
    genre: 'RPG',
    coverUrl: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?auto=format&fit=crop&w=600&q=80',
    releaseYear: 1997,
    rating: 5.0,
    description: 'A mercenary and an eco-terrorist group fight to save the planet.'
  },
  {
    id: 'g19',
    title: 'Castlevania: SotN',
    genre: 'Action RPG',
    coverUrl: 'https://images.unsplash.com/photo-1554055462-772a2e3e530c?auto=format&fit=crop&w=600&q=80',
    releaseYear: 1997,
    rating: 4.9,
    description: 'Explore Dracula\'s massive castle in this non-linear classic.'
  },
  {
    id: 'g20',
    title: 'Crash Bandicoot: Warped',
    genre: 'Platformer',
    coverUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80',
    releaseYear: 1998,
    rating: 4.7,
    description: 'Time-traveling platforming marsupial action.'
  },
  {
    id: 'g_gt2',
    title: 'Gran Turismo 2',
    genre: 'Racing',
    coverUrl: 'https://images.unsplash.com/photo-1517524008697-5920c8e0ec94?auto=format&fit=crop&w=600&q=80',
    releaseYear: 1999,
    rating: 4.8,
    description: 'The Real Driving Simulator with over 600 cars.'
  },
  {
    id: 'g_thps2',
    title: 'Tony Hawk\'s Pro Skater 2',
    genre: 'Sports',
    coverUrl: 'https://images.unsplash.com/photo-1520045864906-720dd325ad44?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2000,
    rating: 5.0,
    description: 'The quintessential skateboarding game with a legendary soundtrack.'
  },

  // --- PS2 (PlayStation 2) ---
  {
    id: 'g8',
    title: 'Street Crime: San Andreas',
    genre: 'Action',
    coverUrl: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2004,
    rating: 4.9,
    description: 'Massive open world crime simulator.'
  },
  {
    id: 'g14',
    title: 'Fantasy Finality 10',
    genre: 'RPG',
    coverUrl: 'https://images.unsplash.com/photo-1605218427368-351816b555e5?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2001,
    rating: 4.7,
    description: 'Turn-based masterpiece with stunning summon animations.'
  },
  {
    id: 'g22',
    title: 'Shadow of the Colossus',
    genre: 'Action Adventure',
    coverUrl: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2005,
    rating: 4.9,
    description: 'Defeat massive giants in a desolate land to revive a loved one.'
  },
  {
    id: 'g23',
    title: 'Kingdom Hearts II',
    genre: 'Action RPG',
    coverUrl: 'https://images.unsplash.com/photo-1570215876329-052634088237?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2005,
    rating: 4.8,
    description: 'Disney and Final Fantasy characters unite against the darkness.'
  },
  {
    id: 'g_gt3',
    title: 'Gran Turismo 3: A-Spec',
    genre: 'Racing',
    coverUrl: 'https://images.unsplash.com/photo-1532906619279-a7d61936d07e?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2001,
    rating: 4.9,
    description: 'The best-selling game on PS2 with photorealistic graphics for its time.'
  },
  {
    id: 'g_madden05',
    title: 'Madden NFL 2005',
    genre: 'Sports',
    coverUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2004,
    rating: 4.7,
    description: 'Introduced the Hit Stick. Defense wins championships.'
  },
  {
    id: 'g_ssx',
    title: 'SSX Tricky',
    genre: 'Sports',
    coverUrl: 'https://images.unsplash.com/photo-1523282602130-727c6090737e?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2001,
    rating: 4.8,
    description: 'It\'s Tricky! Over-the-top snowboarding action.'
  },

  // --- PS3 (PlayStation 3) ---
  {
    id: 'g12',
    title: 'Treasure Hunter 2',
    genre: 'Action Adventure',
    coverUrl: 'https://images.unsplash.com/photo-1598550476439-c93e9281d6fe?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2009,
    rating: 4.9,
    description: 'Cinematic treasure hunting around the globe.'
  },
  {
    id: 'g24',
    title: 'The Last of Us',
    genre: 'Action Adventure',
    coverUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2013,
    rating: 5.0,
    description: 'A brutal journey across a post-pandemic United States.'
  },
  {
    id: 'g25',
    title: 'Red Dead Redemption',
    genre: 'Action Adventure',
    coverUrl: 'https://images.unsplash.com/photo-1619360212258-e88750f381ba?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2010,
    rating: 4.9,
    description: 'Open world western following John Marston.'
  },
  {
    id: 'g_fifa14',
    title: 'FIFA 14',
    genre: 'Sports',
    coverUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2013,
    rating: 4.6,
    description: 'Known for introducing the Ignite Engine (on next-gen) and great gameplay.'
  },
  {
    id: 'g_nba2k11',
    title: 'NBA 2K11',
    genre: 'Sports',
    coverUrl: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2010,
    rating: 4.9,
    description: 'Featuring the Jordan Challenge, often cited as the greatest sports game.'
  },

  // --- PSP (PlayStation Portable) ---
  {
    id: 'g9',
    title: 'Spartan Wars: CoO',
    genre: 'Hack and Slash',
    coverUrl: 'https://images.unsplash.com/photo-1551429746-32955c4a8f42?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2008,
    rating: 4.7,
    description: 'Portable god-slaying action.'
  },
  {
    id: 'g32',
    title: 'Persona 3 Portable',
    genre: 'RPG',
    coverUrl: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2009,
    rating: 4.8,
    description: 'Balancing high school life with fighting shadows during the Dark Hour.'
  },
  {
    id: 'g33',
    title: 'MGS: Peace Walker',
    genre: 'Stealth Action',
    coverUrl: 'https://images.unsplash.com/photo-1627856013091-f77497696a8c?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2010,
    rating: 4.9,
    description: 'Build your own army and uncover nuclear conspiracies.'
  },

  // --- PS Vita ---
  {
    id: 'g34',
    title: 'Persona 4 Golden',
    genre: 'RPG',
    coverUrl: 'https://images.unsplash.com/photo-1529336953128-a8529f9fd284?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2012,
    rating: 4.9,
    description: 'Solving a murder mystery in a foggy rural town.'
  },
  {
    id: 'g35',
    title: 'Uncharted: Golden Abyss',
    genre: 'Action Adventure',
    coverUrl: 'https://images.unsplash.com/photo-1611532736579-6b158f042245?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2011,
    rating: 4.5,
    description: 'Drake uncovers the dark secret behind a Spanish massacre.'
  },

  // --- Xbox Original ---
  {
    id: 'g10',
    title: 'Halo: Combat Evolved',
    genre: 'FPS',
    coverUrl: 'https://images.unsplash.com/photo-1599582226733-179163b9d1d0?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2001,
    rating: 4.8,
    description: 'The sci-fi shooter that launched a console empire.'
  },
  {
    id: 'g29',
    title: 'Fable',
    genre: 'Action RPG',
    coverUrl: 'https://images.unsplash.com/photo-1582369948806-3667731f33d8?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2004,
    rating: 4.6,
    description: 'For every choice, a consequence. Be a hero or a villain.'
  },

  // --- Xbox 360 ---
  {
    id: 'g13',
    title: 'Cog Soldiers',
    genre: 'TPS',
    coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2006,
    rating: 4.8,
    description: 'Cover-based shooter that defined the generation.'
  },
  {
    id: 'g26',
    title: 'Halo 3',
    genre: 'FPS',
    coverUrl: 'https://images.unsplash.com/photo-1620641788421-7f1c336b4a76?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2007,
    rating: 4.9,
    description: 'Finish the fight in this epic conclusion to the original trilogy.'
  },
  {
    id: 'g27',
    title: 'Mass Effect 2',
    genre: 'Action RPG',
    coverUrl: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2010,
    rating: 5.0,
    description: 'Assemble a team of dangerous outcasts to save humanity.'
  }
];

export const CONSOLES: ConsoleModel[] = [
  // --- Nintendo ---
  {
    id: 'c_nes',
    name: 'NES Classic',
    type: ConsoleType.RETRO,
    tier: PerformanceTier.STANDARD,
    hourlyRate: 0.50,
    specs: '8-bit, 2KB RAM, Save States',
    imageUrl: 'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?auto=format&fit=crop&w=800&q=80',
    supportedGames: ['g2', 'g38', 'g39']
  },
  {
    id: 'c_snes',
    name: 'Super NES',
    type: ConsoleType.RETRO,
    tier: PerformanceTier.STANDARD,
    hourlyRate: 0.60,
    specs: '16-bit, Mode 7 Graphics, Rewind',
    imageUrl: 'https://images.unsplash.com/photo-1593118247619-e2d6f056869e?auto=format&fit=crop&w=800&q=80',
    supportedGames: ['g5', 'g36', 'g37', 'g_nbajam']
  },
  {
    id: 'c_n64',
    name: 'Nintendo 64',
    type: ConsoleType.RETRO,
    tier: PerformanceTier.PRO,
    hourlyRate: 0.80,
    specs: '64-bit, 4-Player Local, HD Upscale',
    imageUrl: 'https://images.unsplash.com/photo-1592107761705-30a1bbc641e7?auto=format&fit=crop&w=800&q=80',
    supportedGames: ['g15', 'g16', 'g17', 'g3', 'g_fifa98', 'g_thps2']
  },

  // --- Sega ---
  {
    id: 'c_genesis',
    name: 'Sega Genesis',
    type: ConsoleType.RETRO,
    tier: PerformanceTier.STANDARD,
    hourlyRate: 0.60,
    specs: '16-bit, Blast Processing',
    imageUrl: 'https://images.unsplash.com/photo-1523843268911-45a882919fce?auto=format&fit=crop&w=800&q=80',
    supportedGames: ['g7', 'g44', 'g_nbajam']
  },
  {
    id: 'c_dreamcast',
    name: 'Sega Dreamcast',
    type: ConsoleType.RETRO,
    tier: PerformanceTier.PRO,
    hourlyRate: 0.90,
    specs: '128-bit, VMU Support, VGA Output',
    imageUrl: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=800&q=80',
    supportedGames: ['g30', 'g31', 'g45', 'g_thps2']
  },

  // --- PlayStation ---
  {
    id: 'c_ps1',
    name: 'PlayStation 1',
    type: ConsoleType.RETRO,
    tier: PerformanceTier.STANDARD,
    hourlyRate: 0.70,
    specs: '32-bit, CD Quality Audio, Texture Correction',
    imageUrl: 'https://images.unsplash.com/photo-1570993768033-e8ae4d01996b?auto=format&fit=crop&w=800&q=80',
    supportedGames: ['g6', 'g18', 'g19', 'g20', 'g_gt2', 'g_thps2', 'g_fifa14']
  },
  {
    id: 'c_ps2',
    name: 'PlayStation 2',
    type: ConsoleType.RETRO,
    tier: PerformanceTier.PRO,
    hourlyRate: 1.00,
    specs: 'Emotion Engine, DVD Playback, 4K Upscale',
    imageUrl: 'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?auto=format&fit=crop&w=800&q=80',
    supportedGames: ['g8', 'g14', 'g22', 'g23', 'g_gt3', 'g_madden05', 'g_ssx', 'cod3']
  },
  {
    id: 'c_ps3',
    name: 'PlayStation 3',
    type: ConsoleType.RETRO,
    tier: PerformanceTier.PRO,
    hourlyRate: 1.50,
    specs: 'Cell Processor, Blu-ray, HD Streaming',
    imageUrl: 'https://images.unsplash.com/photo-1595956552753-b2360c08b8b0?auto=format&fit=crop&w=800&q=80',
    supportedGames: ['g12', 'g24', 'g25', 'g_nba2k11', 'g_fifa14', 'cod4_mw', 'cod_mw2_2009', 'cod_bo', 'cod_bo2', 'cod_waw']
  },
  {
    id: 'c_psp',
    name: 'PSP Handheld',
    type: ConsoleType.RETRO,
    tier: PerformanceTier.STANDARD,
    hourlyRate: 0.60,
    specs: 'Portable Power, UMD Emulation',
    imageUrl: 'https://images.unsplash.com/photo-1574602379454-d62318594136?auto=format&fit=crop&w=800&q=80',
    supportedGames: ['g9', 'g32', 'g33', 'g_fifa98']
  },
  {
    id: 'c_vita',
    name: 'PS Vita',
    type: ConsoleType.RETRO,
    tier: PerformanceTier.PRO,
    hourlyRate: 0.80,
    specs: 'OLED Simulation, Touch Controls',
    imageUrl: 'https://images.unsplash.com/photo-1561658768-53720f95aa85?auto=format&fit=crop&w=800&q=80',
    supportedGames: ['g34', 'g35', 'g_fifa14']
  },
  
  // --- Xbox ---
  {
    id: 'c_xbox',
    name: 'Xbox Original',
    type: ConsoleType.RETRO,
    tier: PerformanceTier.PRO,
    hourlyRate: 1.00,
    specs: 'DirectX Box, HDD Loading, LAN Support',
    imageUrl: 'https://images.unsplash.com/photo-1621259182903-55b9299894fa?auto=format&fit=crop&w=800&q=80',
    supportedGames: ['g10', 'g29', 'g_madden05', 'g_ssx', 'cod3']
  },
  {
    id: 'c_xb360',
    name: 'Xbox 360',
    type: ConsoleType.RETRO,
    tier: PerformanceTier.PRO,
    hourlyRate: 1.50,
    specs: 'Triple Core Xenon, Achievements',
    imageUrl: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&w=800&q=80',
    supportedGames: ['g13', 'g26', 'g27', 'g25', 'g_nba2k11', 'g_fifa14', 'cod2', 'cod4_mw', 'cod_mw2_2009', 'cod_bo', 'cod_bo2', 'cod_waw'] 
  },

  // --- Modern ---
  {
    id: 'c_ps4',
    name: 'PlayStation 4 Pro',
    type: ConsoleType.MODERN,
    tier: PerformanceTier.ULTRA,
    hourlyRate: 2.00,
    specs: '4K Gaming, HDR, Share Play',
    imageUrl: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=800&q=80',
    supportedGames: ['g11', 'g4', 'g41', 'g42', 'g43', 'g_gt7', 'g_fc24', 'cod_mw_2019', 'cod_warzone', 'cod_mw3_2023']
  },
  {
    id: 'c_ps5',
    name: 'PlayStation 5',
    type: ConsoleType.MODERN,
    tier: PerformanceTier.ULTRA,
    hourlyRate: 2.50,
    specs: '10TFLOPS, Ray Tracing, 120FPS Stream',
    imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80',
    supportedGames: ['g1', 'g40', 'g41', 'g42', 'g43', 'g_gt7', 'g_fc24', 'cod_mw3_2023', 'cod_warzone']
  },
  {
    id: 'c_pc',
    name: 'Titan PC Rig',
    type: ConsoleType.PC,
    tier: PerformanceTier.ULTRA,
    hourlyRate: 3.50,
    specs: 'RTX 4090 Equiv, 64GB RAM, 240Hz Stream',
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    supportedGames: ['g1', 'g4', 'g40', 'g41', 'g42', 'g43', 'g_fc24', 'cod_classic', 'cod2', 'cod4_mw', 'cod_mw2_2009', 'cod_bo', 'cod_bo2', 'cod_mw_2019', 'cod_warzone', 'cod_mw3_2023']
  }
];

export const TOURNAMENTS: Tournament[] = [
  {
    id: 't1',
    title: 'Retro Tag Team Rumble',
    gameId: 'g_nbajam',
    format: '2v2 Tag Team',
    participants: 12,
    maxParticipants: 32,
    prizePool: '$500 Credit',
    status: TournamentStatus.REGISTRATION,
    region: 'Global',
    startTime: 'Starts in 2h',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 't2',
    title: 'FC 24 Global Cup',
    gameId: 'g_fc24',
    format: '1v1',
    participants: 128,
    maxParticipants: 256,
    prizePool: '$2,000',
    status: TournamentStatus.LIVE,
    region: 'EU',
    startTime: 'Live Now',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 't3',
    title: 'Iron Fist Tag Tournament',
    gameId: 'g37', // Street Fighter as placeholder
    format: '2v2 Tag Team',
    participants: 45,
    maxParticipants: 64,
    prizePool: '$1,000',
    status: TournamentStatus.REGISTRATION,
    region: 'ASIA',
    startTime: 'Starts Tomorrow',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 't4',
    title: 'Apex Legends Squad Wipe',
    gameId: 'g43',
    format: 'Squad',
    participants: 20,
    maxParticipants: 20,
    prizePool: '$1,500',
    status: TournamentStatus.COMPLETED,
    region: 'NA',
    startTime: 'Ended Yesterday',
    imageUrl: 'https://images.unsplash.com/photo-1614741487319-f943939846af?auto=format&fit=crop&w=800&q=80'
  }
];

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { rank: 1, username: 'SpeedDemon_X', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80', region: 'NA', rating: 2850, winRate: '78%', favoriteGame: 'Apex Legends', tier: 'Grandmaster', trend: 'STABLE' },
  { rank: 2, username: 'PixelQueen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', region: 'EU', rating: 2815, winRate: '72%', favoriteGame: 'Street Fighter II', tier: 'Grandmaster', trend: 'UP' },
  { rank: 3, username: 'KratosFan88', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80', region: 'ASIA', rating: 2790, winRate: '69%', favoriteGame: 'God of War', tier: 'Master', trend: 'DOWN' },
  { rank: 4, username: 'RetroWave', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=100&q=80', region: 'EU', rating: 2650, winRate: '65%', favoriteGame: 'Sonic Adventure 2', tier: 'Master', trend: 'UP' },
  { rank: 5, username: 'SniperWolf', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80', region: 'NA', rating: 2580, winRate: '61%', favoriteGame: 'GoldenEye 007', tier: 'Diamond', trend: 'STABLE' },
  { rank: 6, username: 'CloudWalker', avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=100&q=80', region: 'SA', rating: 2510, winRate: '58%', favoriteGame: 'FIFA 14', tier: 'Diamond', trend: 'DOWN' },
  { rank: 7, username: 'PlayerOne', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80', region: 'US-EAST', rating: 2450, winRate: '55%', favoriteGame: 'Cyber Odyssey', tier: 'Diamond II', trend: 'UP' },
  { rank: 8, username: 'DriftKing', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', region: 'ASIA', rating: 2400, winRate: '52%', favoriteGame: 'Gran Turismo 7', tier: 'Platinum', trend: 'UP' },
  { rank: 9, username: 'RPG_Lover', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80', region: 'EU', rating: 2350, winRate: '49%', favoriteGame: 'Final Fantasy VII', tier: 'Platinum', trend: 'STABLE' },
  { rank: 10, username: 'NoobMaster69', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80', region: 'NA', rating: 2200, winRate: '45%', favoriteGame: 'Fortnite', tier: 'Gold', trend: 'DOWN' },
];
