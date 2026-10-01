// Global brand list shown in the product form's brand picker.
// Sellers can still enter a custom brand if theirs isn't listed — the backend stores brand as a plain string.
export const BRANDS = [
  // Sportswear & sneakers
  'Nike', 'Jordan', 'Adidas', 'Puma', 'Reebok', 'New Balance', 'Asics', 'Under Armour', 'Converse', 'Vans',
  'Fila', 'Skechers', 'Saucony', 'Brooks', 'Hoka', 'On', 'Mizuno', 'Salomon', 'Merrell', 'Columbia',
  'The North Face', 'Champion', 'Kappa', 'Umbro', 'Lotto', 'Diadora', 'Le Coq Sportif', 'Ellesse', 'Lacoste',
  'Onitsuka Tiger', 'K-Swiss', 'Etnies', 'DC Shoes', 'Li-Ning', 'Anta', 'Peak', 'Xtep', '361°', 'Yonex',
  'Wilson', 'Babolat', 'Head', 'Decathlon', 'Kalenji', 'Gymshark', 'Lululemon', 'Patagonia', 'Arc\'teryx',

  // Footwear & boots
  'Dr. Martens', 'Timberland', 'Clarks', 'Birkenstock', 'Crocs', 'UGG', 'Ecco', 'Geox', 'Hush Puppies',
  'Bata', 'Woodland', 'Red Wing', 'Wolverine', 'Caterpillar', 'Steve Madden', 'Aldo', 'Nine West',
  'Sperry', 'Toms', 'Havaianas', 'Teva', 'Keen', 'Camper', 'Veja', 'Allbirds', 'Common Projects',

  // Fashion & apparel
  "Levi's", 'Wrangler', 'Lee', 'Diesel', 'G-Star Raw', 'Calvin Klein', 'Tommy Hilfiger', 'Ralph Lauren',
  'Polo Ralph Lauren', 'Hugo Boss', 'Armani', 'Emporio Armani', 'Guess', 'Gap', 'Old Navy', 'Banana Republic',
  'Zara', 'H&M', 'Uniqlo', 'Mango', 'Forever 21', 'Bershka', 'Pull&Bear', 'Massimo Dutti', 'Stradivarius',
  'Topshop', 'ASOS', 'Shein', 'Superdry', 'Jack & Jones', 'Only', 'Vero Moda', 'Abercrombie & Fitch',
  'Hollister', 'American Eagle', 'Carhartt', 'Dickies', 'Stüssy', 'Supreme', 'Off-White', 'Fear of God',
  'Essentials', 'Palace', 'Kith', 'BAPE', 'Stone Island', 'C.P. Company', 'Fred Perry', 'Ben Sherman',
  'Barbour', 'Burberry', 'Canada Goose', 'Moncler',

  // Luxury
  'Gucci', 'Louis Vuitton', 'Prada', 'Chanel', 'Dior', 'Hermès', 'Balenciaga', 'Versace', 'Fendi',
  'Givenchy', 'Saint Laurent', 'Valentino', 'Bottega Veneta', 'Alexander McQueen', 'Dolce & Gabbana',
  'Moschino', 'Kenzo', 'Loewe', 'Celine', 'Miu Miu', 'Golden Goose', 'Christian Louboutin', 'Jimmy Choo',
  'Michael Kors', 'Coach', 'Kate Spade', 'Tory Burch', 'Marc Jacobs',

  // Accessories, bags & watches
  'Ray-Ban', 'Oakley', 'Fossil', 'Casio', 'G-Shock', 'Seiko', 'Citizen', 'Timex', 'Swatch', 'Tissot',
  'Rolex', 'Omega', 'Tag Heuer', 'Daniel Wellington', 'Samsonite', 'Herschel', 'JanSport', 'Eastpak',
  'Fjällräven', 'Tumi', 'New Era', '47 Brand',

  // Electronics
  'Apple', 'Samsung', 'Sony', 'LG', 'Huawei', 'Xiaomi', 'Oppo', 'Vivo', 'OnePlus', 'Realme', 'Tecno',
  'Infinix', 'Itel', 'Nokia', 'Motorola', 'Google', 'Lenovo', 'HP', 'Dell', 'Asus', 'Acer', 'Microsoft',
  'JBL', 'Bose', 'Beats', 'Sennheiser', 'Anker', 'Logitech', 'Canon', 'Nikon', 'GoPro', 'Hisense', 'TCL',
  'Philips', 'Panasonic',

  // Beauty & personal care
  "L'Oréal", 'Maybelline', 'MAC', 'Fenty Beauty', 'Nivea', 'Dove', 'Vaseline', 'Garnier', 'Neutrogena',
  'CeraVe', 'The Ordinary', 'Clinique', 'Estée Lauder', 'Olay',
] as const
