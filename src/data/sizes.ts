import type { SizeData } from '@/types'

export const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'] as const

export const SIZE_CHART_IMG = '/size-chart.jpg'

export const SIZE_DATA: SizeData = {
  tshirt: {
    men: [
      { size: 'S',   intl: 'S',   eu: '44–46', uk: '34–36', chest: '88–92',   waist: '76–80',   length: '70', sleeve: '22' },
      { size: 'M',   intl: 'M',   eu: '48–50', uk: '38–40', chest: '96–100',  waist: '84–88',   length: '72', sleeve: '23' },
      { size: 'L',   intl: 'L',   eu: '52–54', uk: '42–44', chest: '104–108', waist: '92–96',   length: '74', sleeve: '24' },
      { size: 'XL',  intl: 'XL',  eu: '56–58', uk: '46–48', chest: '112–116', waist: '100–104', length: '76', sleeve: '25' },
      { size: '2XL', intl: '2XL', eu: '60–62', uk: '50–52', chest: '120–124', waist: '108–112', length: '78', sleeve: '26' },
      { size: '3XL', intl: '3XL', eu: '64–66', uk: '54–56', chest: '128–132', waist: '116–120', length: '80', sleeve: '27' },
    ],
    women: [
      { size: 'S',   intl: 'S',   eu: '36–38', uk: '8–10',  chest: '84–88',   waist: '68–72',   hip: '92–96',   length: '60', sleeve: '20' },
      { size: 'M',   intl: 'M',   eu: '40–42', uk: '12–14', chest: '92–96',   waist: '76–80',   hip: '100–104', length: '62', sleeve: '21' },
      { size: 'L',   intl: 'L',   eu: '44–46', uk: '16–18', chest: '100–104', waist: '84–88',   hip: '108–112', length: '64', sleeve: '22' },
      { size: 'XL',  intl: 'XL',  eu: '48–50', uk: '20–22', chest: '108–112', waist: '92–96',   hip: '116–120', length: '66', sleeve: '23' },
      { size: '2XL', intl: '2XL', eu: '52–54', uk: '24–26', chest: '116–120', waist: '100–104', hip: '124–128', length: '68', sleeve: '24' },
      { size: '3XL', intl: '3XL', eu: '56–58', uk: '28–30', chest: '124–128', waist: '108–112', hip: '132–136', length: '70', sleeve: '25' },
    ],
  },
  hoodie: {
    men: [
      { size: 'S',   intl: 'S',   eu: '44–46', uk: '34–36', chest: '96–100',  waist: '84–88',   length: '68', sleeve: '62' },
      { size: 'M',   intl: 'M',   eu: '48–50', uk: '38–40', chest: '104–108', waist: '92–96',   length: '70', sleeve: '64' },
      { size: 'L',   intl: 'L',   eu: '52–54', uk: '42–44', chest: '112–116', waist: '100–104', length: '72', sleeve: '65' },
      { size: 'XL',  intl: 'XL',  eu: '56–58', uk: '46–48', chest: '120–124', waist: '108–112', length: '74', sleeve: '66' },
      { size: '2XL', intl: '2XL', eu: '60–62', uk: '50–52', chest: '128–132', waist: '116–120', length: '76', sleeve: '67' },
      { size: '3XL', intl: '3XL', eu: '64–66', uk: '54–56', chest: '136–140', waist: '124–128', length: '78', sleeve: '68' },
    ],
    women: [
      { size: 'S',   intl: 'S',   eu: '36–38', uk: '8–10',  chest: '92–96',   waist: '76–80',   hip: '100–104', length: '62', sleeve: '58' },
      { size: 'M',   intl: 'M',   eu: '40–42', uk: '12–14', chest: '100–104', waist: '84–88',   hip: '108–112', length: '64', sleeve: '59' },
      { size: 'L',   intl: 'L',   eu: '44–46', uk: '16–18', chest: '108–112', waist: '92–96',   hip: '116–120', length: '66', sleeve: '60' },
      { size: 'XL',  intl: 'XL',  eu: '48–50', uk: '20–22', chest: '116–120', waist: '100–104', hip: '124–128', length: '68', sleeve: '61' },
      { size: '2XL', intl: '2XL', eu: '52–54', uk: '24–26', chest: '124–128', waist: '108–112', hip: '132–136', length: '70', sleeve: '62' },
      { size: '3XL', intl: '3XL', eu: '56–58', uk: '28–30', chest: '132–136', waist: '116–120', hip: '140–144', length: '72', sleeve: '63' },
    ],
  },
  zipper: {
    men: [
      { size: 'S',   intl: 'S',   eu: '44–46', uk: '34–36', chest: '96–100',  waist: '84–88',   length: '68', sleeve: '62' },
      { size: 'M',   intl: 'M',   eu: '48–50', uk: '38–40', chest: '104–108', waist: '92–96',   length: '70', sleeve: '64' },
      { size: 'L',   intl: 'L',   eu: '52–54', uk: '42–44', chest: '112–116', waist: '100–104', length: '72', sleeve: '65' },
      { size: 'XL',  intl: 'XL',  eu: '56–58', uk: '46–48', chest: '120–124', waist: '108–112', length: '74', sleeve: '66' },
      { size: '2XL', intl: '2XL', eu: '60–62', uk: '50–52', chest: '128–132', waist: '116–120', length: '76', sleeve: '67' },
      { size: '3XL', intl: '3XL', eu: '64–66', uk: '54–56', chest: '136–140', waist: '124–128', length: '78', sleeve: '68' },
    ],
    women: [
      { size: 'S',   intl: 'S',   eu: '36–38', uk: '8–10',  chest: '92–96',   waist: '76–80',   hip: '100–104', length: '62', sleeve: '58' },
      { size: 'M',   intl: 'M',   eu: '40–42', uk: '12–14', chest: '100–104', waist: '84–88',   hip: '108–112', length: '64', sleeve: '59' },
      { size: 'L',   intl: 'L',   eu: '44–46', uk: '16–18', chest: '108–112', waist: '92–96',   hip: '116–120', length: '66', sleeve: '60' },
      { size: 'XL',  intl: 'XL',  eu: '48–50', uk: '20–22', chest: '116–120', waist: '100–104', hip: '124–128', length: '68', sleeve: '61' },
      { size: '2XL', intl: '2XL', eu: '52–54', uk: '24–26', chest: '124–128', waist: '108–112', hip: '132–136', length: '70', sleeve: '62' },
      { size: '3XL', intl: '3XL', eu: '56–58', uk: '28–30', chest: '132–136', waist: '116–120', hip: '140–144', length: '72', sleeve: '63' },
    ],
  },
}
