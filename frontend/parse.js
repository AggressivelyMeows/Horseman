var fs = require('fs')
const { parse } = require("csv-parse");

const list = `
Ashburn, US
Atlanta, US
Boston, US
Buffalo, US
Calgary, CA
Charlotte, US
Chicago, US
Columbus, US
Dallas, US
Denver, US
Detroit, US
Honolulu, US
Houston, US
Indianapolis, US
Jacksonville, US
Kansas City, US
Las Vegas, US
Los Angeles, US
Mcallen, US
Memphis, US
Miami, US
Minneapolis, US
Montgomery, US
Montréal, CA
Nashville, US
Newark, US
Norfolk, US
Omaha, US
Ottawa, CA
Philadelphia, US
Phoenix, US
Pittsburgh, US
Portland, US
Richmond, US
Sacramento, US
Salt Lake City, US
San Diego, US
San Jose, US
Saskatoon, CA
Seattle, US
St. Louis, US
Tallahassee, US
Tampa, US
Toronto, CA
Vancouver, CA
Winnipeg, CA
Amsterdam, NL
Athens, GR
Barcelona, ES
Belgrade, RS
Berlin, DE
Brussels, BE
Bucharest, RO
Budapest, HU
Chișinău, MD
Copenhagen, DK
Cork, IE
Dublin, IE
Düsseldorf, DE
Edinburgh, GB
Ekaterinburg, RU
Frankfurt, DE
Geneva, CH
Gothenburg, SE
Hamburg, DE
Helsinki, FI
Istanbul, TR
Khabarovsk, RU
Krasnoyarsk, RU
Kyiv, UA
Lisbon, PT
London, GB
Luxembourg City, LU
Madrid, ES
Manchester, GB
Marseille, FR
Milan, IT
Minsk, BY
Moscow, RU
Munich, DE
Nicosia, CY
Oslo, NO
Palermo, IT
Paris, FR
Prague, CZ
Reykjavík, IS
Riga, LV
Rome, IT
Sofia, BG
St. Petersburg, RU
Stockholm, SE
Tallinn, EE
Thessaloniki, GR
Vienna, AT
Vilnius, LT
Warsaw, PL
Zagreb, HR
Zürich, CHAdelaide, AU
Auckland, NZ
Brisbane, AU
Canberra, AU
Guam, GU
Melbourne, AU
Noumea, NC
Perth, AU
Sydney, AUAccra, GH
Algiers, DZ
Antananarivo, MG
Cape Town, ZA
Casablanca, MA
Dakar, SN
Dar Es Salaam, TZ
Djibouti, DJ
Durban, ZA
Harare, ZW
Johannesburg, ZA
Kigali, RW
Lagos, NG
Luanda, AO
Maputo, MZ
Mombasa, KE
Monrovia, LR
Nairobi, KE
Port Louis, MU
Reunion, FR
Tunis, TNAhmedabad, IN
Almaty, KZ
Baku, AZ
Bandar Seri Begawan, BN
Bangkok, TH
Bengaluru, IN
Bhubaneshwar, IN
Cagayan, PH
Cebu, PH
Chandigarh, IN
Chennai, IN
Chiang Mai, TH
Chittagong, BD
Colombo, LK
Dhaka, BD
Fukuoka, JP
Hanoi, VN
Ho Chi Minh City, VN
Hong Kong
Hyderabad, IN
Islamabad, PK
Jakarta, ID
Jashore, BD
Johor Bahru, MY
Kanpur, IN
Karachi, PK
Kathmandu, NP
Kolkata, IN
Kuala Lumpur, MY
Lahore, PK
Macau
Male, MV
Mandalay, MM
Manila, PH
Mumbai, IN
Nagpur, IN
Naha, JP
New Delhi, IN
Osaka, JP
Patna, IN
Phnom Penh, KH
Seoul, KR
Singapore, SG
Surat Thani, TH
Taipei
Tashkent, UZ
Tbilisi, GE
Thimphu, BT
Tokyo, JP
Ulaanbaatar, MN
Vientiane, LA
Yangon, MM
Yerevan, AM
Yogyakarta, IDAmman, JO
Baghdad, IQ
Beirut, LB
Dammam, SA
Doha, QA
Dubai, AE
Erbil, IQ
Haifa, IL
Jeddah, SA
Kuwait City, KW
Manama, BH
Muscat, OM
Ramallah
Riyadh, SA
Tel Aviv, ILAmericana, BR
Arica, CL
Asuncion, PY
Belo Horizonte, BR
Belém, BR
Blumenau, BR
Bogota, CO
Brasília, BR
Buenos Aires, AR
Campinas, BR
Caçador, BR
Cordoba, AR
Curitiba, BR
Florianópolis, BR
Fortaleza, BR
Goiânia, BR
Guatemala City, GT
Guayaquil, EC
Itajaí, BR
Joinville, BR
Juazeiro do Norte, BR
Lima, PE
Manaus, BR
Medellín, CO
Mexico City, MX
Neuquen, AR
Panama City, PA
Paramaribo, SR
Port-Au-Prince, HT
Porto Alegre, BR
Queretaro, MX
Quito, EC
Ribeirão Preto, BR
Rio de Janeiro, BR
Salvador, BR
San José, CR
Sorocaba, BR
St. George's, GD
São José do Rio Preto, BR
São Paulo, BR
Tegucigalpa, HN
Uberlândia, BR
Valparaíso, CL
Willemstad, CW`.split('\n').map(x => x.split(',')[0].toLowerCase())

const out = []

fs.createReadStream("./locations.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", (row) => {
        if (list.includes(row[0].toLowerCase())) {
            console.log(row[0])
            out.push(row)
        }
    }).on("end", () => {
        console.log(JSON.stringify(out.map(x => {
            return { location: [parseFloat(x[2]), parseFloat(x[3])], size: 0.1 }
        })))
    })