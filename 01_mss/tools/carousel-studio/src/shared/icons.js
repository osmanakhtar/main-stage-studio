// icons.js — the PureMed line icon suite. Drawn for this app (Main Stage
// Studio), in the fine-line style of the carousel Nafisa approved: single
// weight strokes, round ends, soft curves, small sparkles and dashed paths
// for movement. 64×64 grid, about 6 units of padding, stroke only, so every
// icon takes the colour of the text around it.
//
// Groups (the picker shows them in this order):
//   face and body · skin · treatments and tools · results · care and contact
(function (root) {
  'use strict';

  // A four-point sparkle centred on (x, y), radius r.
  const sp = (x, y, r) => `<path d="M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z"/>`;
  // A small plus-shaped glint.
  const gl = (x, y, r) => `<path d="M${x - r} ${y}h${2 * r}M${x} ${y - r}v${2 * r}"/>`;
  const dot = (x, y, r = 1.1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor" stroke="none"/>`;
  const dash = 'stroke-dasharray="2.2 3.2"';

  const ICONS = {
    // ------------------------------------------------------------ face and body
    face: {
      label: 'Face', group: 'Face and body',
      svg: `<path d="M19 41C15 30 16 14 32 10C48 14 49 30 45 41"/>
        <path d="M23 27C23 19 27 15.5 32 15.5S41 19 41 27C41 36 37 43 32 43S23 36 23 27Z"/>
        <path d="M23.5 23C28 22 31 19 32 15.5C33.5 19 37 21.5 40.5 22.5"/>
        <path d="M26.5 29Q28.3 30.4 30 29M34 29Q35.7 30.4 37.5 29"/>
        <path d="M29.6 37Q32 38.4 34.4 37"/>
        <path d="M27.5 42.5V47C27.5 51 21 52 16 55M36.5 42.5V47C36.5 51 43 52 48 55"/>
        ${sp(11, 30, 3)}${sp(53, 30, 3)}${gl(14, 20, 1.6)}${gl(50, 20, 1.6)}`,
    },
    profile: {
      label: 'Profile', group: 'Face and body',
      svg: `<path d="M42 9C33 8 25.5 13 24.5 21.5L21 28.5L24 29.5C23.6 31 24 32.2 25 32.8C24.4 34.2 25 35.5 26.3 36C26 39.5 28 41.5 31.5 41.2L33 41C33.5 45 32.5 50 30 56"/>
        <path d="M42 9C49 10.5 51.5 17.5 50.5 25C49.5 31.5 45 34.5 43.5 38V42C44.5 47.5 48.5 52 53 56"/>
        <path d="M44 23.5C46 23.5 47 25 46.5 27C46 28.5 45 29 44 28.5"/>`,
    },
    jawline: {
      label: 'Jawline', group: 'Face and body',
      svg: `<path d="M40 8C31 8 24 13 23 21L20 27L23 28C22.6 29.5 23 30.7 24 31.3C23.4 32.7 24 34 25.3 34.5C25 38 27 40 30.5 39.7L35 39C40 39 44 36 46 31"/>
        <path d="M40 8C47 9 50.5 15 50 22C49.6 26 48 29 46 31V39C47 46 50 51 55 56M30.5 40C30.8 46 29.5 51 27 56"/>
        <path d="M31 49C37 46 42 41 45.5 35" ${dash}/>
        <path d="M41 35L46 34L46.5 39"/>
        ${sp(14, 44, 3)}${gl(55, 12, 1.8)}`,
    },
    eye: {
      label: 'Eye area', group: 'Face and body',
      svg: `<path d="M8 30C15 20 25 17 32 17S49 20 56 30C49 39 39 42 32 42S15 39 8 30Z"/>
        <circle cx="32" cy="29.5" r="7"/>${dot(32, 29.5, 2.2)}
        <path d="M15 45C22 51 42 51 49 45" ${dash}/>
        <path d="M14 23L11 19M21 19.5L19.5 15M32 17V12.5M43 19.5L44.5 15M50 23L53 19"/>`,
    },
    lips: {
      label: 'Lips', group: 'Face and body',
      svg: `<path d="M8 32C14 25 20 22 25.5 23.5C28.5 24.3 30.5 26 32 26S35.5 24.3 38.5 23.5C44 22 50 25 56 32C50 40.5 41 45 32 45S14 40.5 8 32Z"/>
        <path d="M8 32C17 33.5 25 34.5 32 33.5C39 34.5 47 33.5 56 32"/>
        ${gl(50, 15, 2)}${sp(56, 21, 2.4)}`,
    },
    neck: {
      label: 'Neck', group: 'Face and body',
      svg: `<path d="M23 8V27C23 35 17 39 7 43M41 8V27C41 35 47 39 57 43"/>
        <path d="M26 20Q32 23 38 20M26 28Q32 31 38 28" ${dash}/>
        <path d="M18 50C24 47 28 47 32 50C36 47 40 47 46 50"/>`,
    },
    body: {
      label: 'Body', group: 'Face and body',
      svg: `<path d="M22 7C22 15 17.5 19 17.5 27C17.5 33 21.5 35 21.5 40C21.5 46 17 50 17 57"/>
        <path d="M42 7C42 15 46.5 19 46.5 27C46.5 33 42.5 35 42.5 40C42.5 46 47 50 47 57"/>
        <path d="M12 38H52" ${dash}/>
        <path d="M14 34L11 38L14 42M50 34L53 38L50 42"/>`,
    },

    // ------------------------------------------------------------ skin
    layers: {
      label: 'Skin layers', group: 'Skin',
      svg: `<path d="M7 20C15 15 23 25 32 20S49 15 57 20"/>
        <path d="M7 32H57" ${dash}/>
        ${dot(14, 26)}${dot(24, 27)}${dot(35, 26)}${dot(46, 27)}${dot(52, 25.5)}
        <path d="M7 44C15 40 21 48 29 44S43 40 50 44 55 46 57 45"/>
        <path d="M7 53C15 49 21 57 29 53S43 49 50 53 55 55 57 54"/>`,
    },
    collagen: {
      label: 'Collagen', group: 'Skin',
      svg: `<path d="M16 8C30 18 34 46 48 56"/>
        <path d="M48 8C34 18 30 46 16 56"/>
        <path d="M24 15.5H40M27.5 24H36.5M27.5 40H36.5M24 48.5H40" ${dash}/>
        ${sp(53, 31, 3.4)}${gl(11, 31, 1.8)}`,
    },
    hydration: {
      label: 'Hydration', group: 'Skin',
      svg: `<path d="M30 8C30 8 14 27 14 38A16 16 0 0 0 46 38C46 27 30 8 30 8Z"/>
        <path d="M22 39A8 8 0 0 0 28.5 47"/>
        ${sp(50, 15, 3.6)}${gl(55, 25, 1.8)}`,
    },
    texture: {
      label: 'Skin quality', group: 'Skin',
      svg: `${dot(13, 15)}${dot(21, 21)}${dot(27, 12)}${dot(36, 19)}${dot(44, 13)}${dot(51, 21)}${dot(31, 26)}${dot(17, 27)}${dot(47, 27.5)}
        <path d="M8 33H56"/>
        ${sp(19, 44, 3.4)}${gl(32, 41, 2)}${sp(44, 47, 4)}${gl(28, 53, 1.6)}${gl(54, 39, 1.6)}`,
    },
    glow: {
      label: 'Radiance', group: 'Skin',
      svg: `<circle cx="32" cy="32" r="10"/>
        <path d="M32 9V15M32 49V55M9 32H15M49 32H55M15.7 15.7L20 20M44 44L48.3 48.3M48.3 15.7L44 20M20 44L15.7 48.3"/>
        ${sp(32, 32, 3.6)}`,
    },
    pigmentation: {
      label: 'Pigmentation', group: 'Skin',
      svg: `<circle cx="32" cy="32" r="23"/>
        <circle cx="24" cy="25" r="3.2"/><circle cx="38" cy="22" r="2"/><circle cx="40" cy="36" r="4"/>
        <circle cx="27" cy="40" r="2.4"/><circle cx="33" cy="30" r="1.4"/>`,
    },
    lines: {
      label: 'Fine lines', group: 'Skin',
      svg: `<path d="M8 21C14 16 20 16 26 21S38 26 44 21 52 17 56 19"/>
        <path d="M8 32C14 27 20 27 26 32S38 37 44 32 52 28 56 30"/>
        <path d="M8 43C14 38 20 38 26 43S38 48 44 43 52 39 56 41"/>`,
    },
    pores: {
      label: 'Pores', group: 'Skin',
      svg: `<path d="M8 40C16 34 24 44 32 38S48 32 56 38"/>
        <circle cx="16" cy="22" r="2.4"/><circle cx="27" cy="16" r="2"/><circle cx="38" cy="22" r="2.6"/><circle cx="48" cy="15" r="1.8"/>
        <circle cx="21" cy="30" r="1.4"/><circle cx="44" cy="29" r="1.6"/>
        ${gl(32, 52, 2)}${sp(20, 52, 2.6)}${sp(45, 52, 2.6)}`,
    },

    // ------------------------------------------------------------ treatments and tools
    syringe: {
      label: 'Injectable', group: 'Treatments and tools',
      svg: `<g transform="rotate(-45 32 32)">
          <rect x="18" y="27" width="25" height="10" rx="2"/>
          <path d="M43 32H51M51 26V38M18 32H5M23 27V31M28 27V31M33 27V31M38 27V31"/>
          <path d="M18 34H25" stroke-width="0.9"/>
        </g>
        <path d="M6 50C9 55 14 58 20 58" ${dash}/>`,
    },
    microneedling: {
      label: 'Microneedling', group: 'Treatments and tools',
      svg: `<g transform="rotate(-45 32 32)">
          <rect x="21" y="26" width="35" height="12" rx="6"/>
          <path d="M21 28.5L14 30.5V33.5L21 35.5M14 31H9M14 32H8.5M14 33H9M33 26V38M37 26V38"/>
        </g>
        ${dot(9, 46)}${dot(14, 50)}${dot(9, 54)}${dot(19, 55)}${dot(14, 58)}${dot(5, 50)}`,
    },
    laser: {
      label: 'Laser', group: 'Treatments and tools',
      svg: `<g transform="rotate(30 32 32)">
          <rect x="27" y="4" width="10" height="20" rx="3"/>
          <path d="M29 24L30.5 29H33.5L35 24"/>
        </g>
        <path d="M27 32L22 44M29.5 33L28.5 45M32 33L34 44" ${dash}/>
        <path d="M7 50C17 46 27 54 37 50S51 46 57 49"/>
        ${sp(28, 49, 2.6)}`,
    },
    fibre: {
      label: 'Laser lift fibre', group: 'Treatments and tools',
      svg: `<path d="M18 52C9 45 13 32 24 33C35 34 34 47 44 43C53 39 51 25 44 18"/>
        <path d="M38.5 17.5L44 17.5L44.5 23"/>
        <path d="M7 58C17 55 47 55 57 58" ${dash}/>
        ${gl(53, 12, 2)}`,
    },
    vial: {
      label: 'Vial', group: 'Treatments and tools',
      svg: `<rect x="24" y="7" width="16" height="7" rx="1.6"/>
        <path d="M26.5 14V19M37.5 14V19"/>
        <rect x="20" y="19" width="24" height="38" rx="4"/>
        <path d="M20 31H44M24.5 37.5H39.5M24.5 43H34"/>
        <path d="M20 49H44" ${dash}/>`,
    },
    dropper: {
      label: 'Serum', group: 'Treatments and tools',
      svg: `<path d="M26 7H38V14C38 16 36 17 36 19V24H28V19C28 17 26 16 26 14Z"/>
        <path d="M28.5 24V44L32 49L35.5 44V24"/>
        <path d="M32 54C32 54 29.5 56.5 29.5 58A2.5 2.5 0 0 0 34.5 58C34.5 56.5 32 54 32 54Z"/>
        ${sp(48, 38, 3)}${gl(16, 40, 1.8)}`,
    },
    brush: {
      label: 'Peel', group: 'Treatments and tools',
      svg: `<path d="M56 6L36 30"/>
        <path d="M36 30L31.5 27L22 40C19 44 17 51 19.5 54.5C23 56 30 53 34 49L40.5 36L36 33Z"/>
        <path d="M24.5 45L28.5 47.5M22 50L26 52"/>
        <path d="M6 59C12 55 18 61 26 59" ${dash}/>`,
    },
    blade: {
      label: 'Dermaplaning', group: 'Treatments and tools',
      svg: `<path d="M57 7L33 31"/>
        <path d="M33 31L28 26L12 42C9.5 44.5 9.5 48 12 50.5L17.5 56C20 58.5 23.5 58.5 26 56L38 43.5Z"/>
        <path d="M15.5 45.5L22.5 52.5"/>
        <path d="M30 60H52" ${dash}/>`,
    },
    jar: {
      label: 'Skincare', group: 'Treatments and tools',
      svg: `<rect x="14" y="20" width="36" height="9" rx="2"/>
        <path d="M17 29V49C17 53 20 55 24 55H40C44 55 47 53 47 49V29"/>
        <path d="M24 41C26 37 30 37 32 40S38 44 40 39"/>
        ${sp(32, 11, 3.2)}${gl(22, 12, 1.6)}${gl(42, 12, 1.6)}`,
    },
    plasma: {
      label: 'Plasma', group: 'Treatments and tools',
      svg: `<g transform="rotate(-45 32 32)">
          <rect x="22" y="26.5" width="33" height="11" rx="5.5"/>
          <path d="M22 29L13 32L22 35M34 26.5V37.5"/>
        </g>
        <path d="M10 47L5 49M9 53L5 57M15 54L14 59"/>
        ${sp(12, 51, 2.6)}`,
    },
    radiofrequency: {
      label: 'Radiofrequency', group: 'Treatments and tools',
      svg: `<path d="M32 44V18"/>
        <path d="M24 26A11 11 0 0 1 40 26M19 21A18 18 0 0 1 45 21M14 16A25 25 0 0 1 50 16"/>
        <path d="M7 50C15 46 23 54 32 50S49 46 57 50"/>
        ${dot(32, 44, 2)}`,
    },
    lotus: {
      label: 'Lotus', group: 'Treatments and tools',
      svg: `<path d="M32 12C38 20 38.5 33 32 42C25.5 33 26 20 32 12Z"/>
        <path d="M32 42C25 40 17 33 15.5 22C23 22.5 29 30 32 42Z"/>
        <path d="M32 42C39 40 47 33 48.5 22C41 22.5 35 30 32 42Z"/>
        <path d="M32 42C22 45 12 42 7 35C14 32 24 35 32 42Z"/>
        <path d="M32 42C42 45 52 42 57 35C50 32 40 35 32 42Z"/>
        <path d="M14 51Q32 46.5 50 51" ${dash}/>`,
    },

    // ------------------------------------------------------------ results
    lift: {
      label: 'Lift', group: 'Results',
      svg: `<path d="M14 50C22 44 30 34 36 20" ${dash}/>
        <path d="M30.5 21.5L36.5 18.5L39 24.5"/>
        <path d="M30 54C37 48 44 40 48 28" ${dash}/>
        <path d="M43.5 30L48.5 26.5L51 32"/>
        ${sp(18, 18, 3)}`,
    },
    firm: {
      label: 'Firmness', group: 'Results',
      svg: `<path d="M8 40C14 30 20 30 26 40S38 50 44 40 52 32 56 34"/>
        <path d="M8 26H56" ${dash}/>
        <path d="M20 22V10M17 13L20 10L23 13M44 22V10M41 13L44 10L47 13"/>`,
    },
    volume: {
      label: 'Volume', group: 'Results',
      svg: `<circle cx="32" cy="32" r="12"/>
        <path d="M32 26V38M26 32H38"/>
        <path d="M32 8V14M32 50V56M8 32H14M50 32H56" ${dash}/>`,
    },
    heavier: {
      label: 'Heaviness', group: 'Results',
      svg: `<path d="M22 21C22 13 26.5 9 32 9S42 13 42 21C42 30 38 35 37 38"/>
        <path d="M22 21C22 30 26 35 27 38"/>
        <path d="M27 38C26 44 22 47 17 49M37 38C38 44 42 47 47 49"/>
        <path d="M29 44Q32 46 35 44"/>
        <path d="M12 26V38M9 35L12 38L15 35M52 26V38M49 35L52 38L55 35" ${dash}/>`,
    },
    tired: {
      label: 'Tiredness', group: 'Results',
      svg: `<path d="M10 24Q32 34 54 24"/>
        <path d="M14 34C20 39 26 40 32 40S44 39 50 34"/>
        <path d="M16 44C22 48 27 49 32 49S42 48 48 44" ${dash}/>
        <path d="M20 19L18 15M32 21V16.5M44 19L46 15"/>`,
    },
    natural: {
      label: 'Natural result', group: 'Results',
      svg: `<path d="M32 56V28"/>
        <path d="M32 40C22 40 14 32 14 20C26 20 32 28 32 40Z"/>
        <path d="M32 32C40 32 48 26 50 14C40 14 32 20 32 32Z"/>
        ${sp(50, 40, 3.2)}${gl(14, 44, 1.8)}`,
    },
    balance: {
      label: 'Proportion', group: 'Results',
      svg: `<path d="M22 22C22 15 26.5 11 32 11S42 15 42 22C42 33 37.5 41 32 41S22 33 22 22Z"/>
        <path d="M32 6V58" ${dash}/>
        <path d="M14 20H50M14 31H50M14 41H50" ${dash}/>
        <path d="M24 50Q32 54 40 50"/>`,
    },
    sparkle: {
      label: 'Sparkle', group: 'Results',
      svg: `${sp(28, 34, 13)}${sp(48, 16, 6)}${sp(49, 46, 4)}${gl(14, 14, 2.4)}`,
    },
    check: {
      label: 'Tick', group: 'Results',
      svg: '<path d="M18 33L28 43L47 22"/>',
    },

    // ------------------------------------------------------------ care and contact
    consult: {
      label: 'Consultation', group: 'Care and contact',
      svg: `<path d="M8 14C8 11 10 9 13 9H35C38 9 40 11 40 14V27C40 30 38 32 35 32H20L12 39V32C9.5 31.5 8 29.5 8 27Z"/>
        <path d="M44 22H51C54 22 56 24 56 27V39C56 42 54 44 51 44V51L44 44H31C28 44 26 42 26 39V36"/>
        <path d="M15 18H33M15 24H27"/>`,
    },
    assess: {
      label: 'Assessment', group: 'Care and contact',
      svg: `<path d="M18 25C18 17 22 13 27 13S36 17 36 25C36 33 32 39 27 39S18 33 18 25Z"/>
        <circle cx="38" cy="37" r="11"/>
        <path d="M46 45L56 55"/>
        <path d="M34 37H42M38 33V41"/>`,
    },
    plan: {
      label: 'Treatment plan', group: 'Care and contact',
      svg: `<rect x="13" y="12" width="38" height="46" rx="4"/>
        <path d="M24 12V9C24 7.5 25 7 26 7H38C39 7 40 7.5 40 9V12C40 13.5 39 14 38 14H26C25 14 24 13.5 24 12Z"/>
        <path d="M20 26L23 29L28 23M33 26H44M20 38L23 41L28 35M33 38H44M20 50L23 53L28 47M33 50H40"/>`,
    },
    safety: {
      label: 'Safety', group: 'Care and contact',
      svg: `<path d="M32 7L52 14V30C52 43 43 52 32 57C21 52 12 43 12 30V14Z"/>
        <path d="M23 32L29.5 38.5L42 25"/>`,
    },
    time: {
      label: 'Time', group: 'Care and contact',
      svg: `<circle cx="32" cy="33" r="22"/>
        <path d="M32 19V33L41 39"/>
        <path d="M26 6H38" />`,
    },
    calendar: {
      label: 'Calendar', group: 'Care and contact',
      svg: `<rect x="9" y="13" width="46" height="42" rx="5"/>
        <path d="M9 25H55M21 8V17M43 8V17"/>
        ${dot(20, 34, 1.6)}${dot(32, 34, 1.6)}${dot(44, 34, 1.6)}${dot(20, 45, 1.6)}${dot(32, 45, 1.6)}
        ${sp(44, 45, 3)}`,
    },
    heart: {
      label: 'Care', group: 'Care and contact',
      svg: `<path d="M32 52C20 44 9 35 9 23C9 16 14 11 20.5 11C25.5 11 29.5 14 32 18C34.5 14 38.5 11 43.5 11C50 11 55 16 55 23C55 35 44 44 32 52Z"/>
        ${sp(43, 26, 3)}`,
    },
    pin: {
      label: 'Location', group: 'Care and contact',
      svg: `<path d="M32 57C32 57 14 39 14 25A18 18 0 0 1 50 25C50 39 32 57 32 57Z"/>
        <circle cx="32" cy="25" r="6.5"/>`,
    },
    whatsapp: {
      label: 'WhatsApp', group: 'Care and contact',
      svg: `<path d="M32 8A24 24 0 0 0 11.2 44L8 56L20.4 52.8A24 24 0 1 0 32 8Z"/>
        <path d="M24 21C22.5 21 21 22.5 21 25C21 32 29 41 38 43C40.5 43.5 42.5 42 43 40.5L43.3 38.5C43.4 37.8 43 37.2 42.4 37L38.4 35.4C37.8 35.2 37.1 35.4 36.8 35.9L35.3 37.8C31.5 36.5 28 33 26.5 29.5L28.4 27.9C28.9 27.5 29 26.8 28.8 26.2L27.3 22.2C27 21.5 26.4 21 25.7 21Z"/>`,
    },
    phone: {
      label: 'Phone', group: 'Care and contact',
      svg: `<rect x="19" y="6" width="26" height="52" rx="5"/>
        <path d="M28 12H36M29 51H35"/>`,
    },
  };

  // Earlier names, kept so existing posts and templates still render.
  const ALIASES = {
    smile: 'face', user: 'face', sparkles: 'sparkle', droplet: 'hydration', droplets: 'hydration',
    waves: 'lines', spline: 'fibre', pipette: 'microneedling', flower: 'lotus',
    trend: 'lift', activity: 'radiofrequency', zap: 'plasma', sun: 'glow', moon: 'tired',
    shield: 'safety', stethoscope: 'consult', search: 'assess', hand: 'heart', leaf: 'natural',
    gem: 'sparkle', feather: 'natural', clock: 'time', target: 'balance', ruler: 'balance',
    scale: 'balance', 'map-pin': 'pin', message: 'whatsapp',
  };

  const resolve = (name) => ICONS[name] || ICONS[ALIASES[name]] || ICONS.check;

  // An icon as inline SVG in the current text colour. weight is relative to
  // the default line (1 = the standard 1.6 on the 64 grid).
  function icon(name, size, weight) {
    const w = (1.6 * (weight || 1)).toFixed(2);
    return '<svg class="ico" width="' + size + '" height="' + size + '" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + resolve(name).svg + '</svg>';
  }

  const api = { ICONS, ALIASES, icon, names: Object.keys(ICONS) };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SlideIcons = api;
})(typeof self !== 'undefined' ? self : this);
