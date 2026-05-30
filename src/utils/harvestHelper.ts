export interface HarvestSchedule {
  date: string;       // YYYY-MM-DD
  status: string;     // 'READY' | 'HARVESTED' | 'FAILED'
  actualDate?: string; // YYYY-MM-DD
  stock: number;
  price: number;
  isPreOrder: boolean;
}

export const getTodayISODate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const convertToISODate = (dateStr?: string) => {
  if (!dateStr) return getTodayISODate();
  
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  
  try {
    const parts = dateStr.trim().split(/\s+/);
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const monthStr = parts[1].toLowerCase();
      const year = parts[2];
      
      const monthsMap: { [key: string]: string } = {
        januari: '01', jan: '01',
        februari: '02', pebruari: '02', feb: '02',
        maret: '03', mar: '03',
        april: '04', apr: '04',
        mei: '05', may: '05',
        juni: '06', jun: '06',
        juli: '07', jul: '07',
        agustus: '08', agt: '08', aug: '08',
        september: '09', sep: '09',
        oktober: '10', okt: '10', oct: '10',
        november: '11', nov: '11',
        desember: '12', des: '12', dec: '12'
      };
      
      const month = monthsMap[monthStr] || '01';
      return `${year}-${month}-${day}`;
    }
  } catch (e) {
    console.error('Failed to parse date string:', dateStr, e);
  }
  
  return getTodayISODate();
};

export const formatISOToFriendlyDate = (isoStr: string) => {
  if (!isoStr) return '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoStr)) return isoStr;
  
  try {
    const parts = isoStr.split('-');
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    return `${day} ${months[monthIndex]} ${year}`;
  } catch (e) {
    return isoStr;
  }
};

export const ensureDayMonthYear = (dateStr: string) => {
  if (!dateStr) return '';
  const iso = convertToISODate(dateStr);
  const parts = iso.split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // dd-mm-yyyy
  }
  return dateStr;
};

/**
 * Parses the harvestDate field of a product safely.
 * Highly backward-compatible: handles both structural JSON strings and old format comma-separated texts.
 */
export function parseHarvestSchedules(
  harvestDateStr: string | undefined,
  baseStock: number = 0,
  basePrice: number = 0,
  baseIsPreOrder: boolean = false
): HarvestSchedule[] {
  if (!harvestDateStr) {
    return [{
      date: getTodayISODate(),
      status: 'READY',
      stock: baseStock,
      price: basePrice,
      isPreOrder: baseIsPreOrder
    }];
  }

  const trimmed = harvestDateStr.trim();
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed) as HarvestSchedule[];
      return parsed.map(item => ({
        ...item,
        date: convertToISODate(item.date),
        status: item.status || 'READY',
        stock: typeof item.stock === 'number' ? item.stock : baseStock,
        price: typeof item.price === 'number' ? item.price : basePrice,
        isPreOrder: typeof item.isPreOrder === 'boolean' ? item.isPreOrder : baseIsPreOrder,
      }));
    } catch (e) {
      console.error('Failed to parse harvestDate JSON', e);
    }
  }

  // Backward compatibility parsing: e.g. "10-06-2026:READY, 25-06-2026:FAILED"
  return trimmed.split(',').map(s => {
    const part = s.trim();
    if (part.includes(':')) {
      const tokens = part.split(':');
      const datePart = tokens[0];
      const statusPart = tokens[1] || 'READY';
      const actualPart = tokens[2];
      
      const isoDate = convertToISODate(datePart);
      const actDate = actualPart ? convertToISODate(actualPart) : undefined;
      
      return {
        date: isoDate,
        status: statusPart,
        actualDate: actDate,
        stock: baseStock,
        price: basePrice,
        isPreOrder: baseIsPreOrder
      };
    }
    
    const isoDate = convertToISODate(part);
    return {
      date: isoDate,
      status: 'READY',
      stock: baseStock,
      price: basePrice,
      isPreOrder: baseIsPreOrder
    };
  });
}

/**
 * Serializes schedules back to database format
 */
export function serializeHarvestSchedules(schedules: HarvestSchedule[]): string {
  return JSON.stringify(schedules);
}
