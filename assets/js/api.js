
const getAPI = {};
const regions = {
    'BandleCity': ['Corki', 'Lulu', 'Rumble', 'Veigar', 'Yuumi', 'Teemo', 'Tristana'],
    'Bilgewater': ['Pyke','Nilah','Fizz', 'Nautilus', 'Gangplank', 'Graves', 'Illaoi', 'MissFortune', 'TahmKench', 'TwistedFate'],
    'Demacia': ['Fiora', 'Garen', 'Galio', 'JarvanIV', 'Kayle', 'Lucian', 'Lux', 'Morgana', 'Poppy', 'Quinn', 'Shyvana', 'Sona', 'Sylas', 'Vayne', 'XinZhao'],
    'Ionia': ['Jhin','Ivern','Irelia','Karma', 'Kayn', 'Kennen', 'LeeSin', 'Lillia', 'MasterYi', 'MonkeyKing', 'Rakan', 'Sett', 'Shen', 'Syndra', 'Varus', 'Xayah', 'Yasuo', 'Yone', 'Zed', 'Ahri', 'Akali'],
    'Ixtal': ['Malphite', 'Neeko', 'Nidalee', 'Qiyana', 'Rengar', 'Zyra'],
    'Noxus': ['Rell','Cassiopeia', 'Darius', 'Draven', 'Katarina', 'Kled', 'Leblanc', 'Mordekaiser', 'Riven', 'Samira', 'Sion', 'Swain', 'Talon', 'Vladimir'],
    'Piltover': ['Caitlyn', 'Camille', 'Ezreal', 'Heimerdinger', 'Jayce', 'Orianna', 'Seraphine', 'Vi'],
    'ShadowIsles': ['Elise', 'Gwen', 'Hecarim', 'Kalista', 'Karthus', 'Maokai', 'Thresh', 'Vex', 'Viego', 'Yorick'],
    'Shurima': ['Akshan', 'Amumu', 'Azir', 'Nasus', 'Rammus', 'Renekton', 'Rengar', 'Sivir', 'Skarner', 'Taliyah', 'Xerath', 'KSante'],
    'Targon': ['Aphelios', 'AurelionSol', 'Diana', 'Leona', 'Pantheon', 'Soraka', 'Taric', 'Zoe'],
    'Freljord': ['Anivia', 'Ashe', 'Braum', 'Gnar', 'Gragas', 'Lissandra', 'Nunu', 'Olaf', 'Ornn', 'Sejuani', 'Trundle', 'Tryndamere', 'Udyr', 'Volibear'],
    'Void': ['Belveth', 'Chogath', 'Kaisa', 'Kassadin', 'Khazix', 'KogMaw', 'Malzahar', 'RekSai', 'Velkoz'],
    'Zaun': ['Blitzcrank', 'DrMundo', 'Ekko', 'Janna', 'Jinx', 'Renata', 'Singed', 'Twitch', 'Urgot', 'Viktor', 'Warwick', 'Zac', 'Ziggs', 'Zeri'],
    'Runeterra': ['Zilean','Shaco','Senna','Ryze','Nocturne','Nami','Kindred','Jax','Fiddlesticks','Evelynn','Brand','Bard', 'Annie', 'Aatrox', 'Ahri', 'Alistar', ]
}

function ChampionJsonToObject(champData) {
    const champ = new Champion()
    const champName = champData.id
    champ.name = champName
    champ.title = champData.title
    champ.desc = champData.lore
    champ.icon = champData.image.full

    const passive = champData.passive.image.full
    const spellsList = champData.spells.map(num => num.image.full)
    let spells = [passive]
    spells = spells.concat(spellsList)
    champ.skills = spells

    const classList = champData.tags.map((champClass) => champClass)
    champ.class = classList

    champ.region = getRegionByChampion(regions, champName)

    return champ
}


getAPI.getChampions = () => {
    const url = `https://ddragon.leagueoflegends.com/cdn/12.22.1/data/en_US/champion.json`
    return fetch(url)
        .then(response => response.json())
        .then(jsonBody => jsonBody.data)
        .then(champsDict => Object.entries(champsDict).map(([key, value]) => ({ [key]: value })))
        .then(champs => champs.map(champ => {
            var champName = Object.keys(champ)[0]
            const details = getAPI.getChampionDetails(champName)
            return details
        }))
        .then(detailRequest => Promise.all(detailRequest))
        .then(champDetails => champDetails) 
        .catch(err => console.error(err));
}

getAPI.getChampionDetails = (champName) => {
    const url = `https://ddragon.leagueoflegends.com/cdn/12.22.1/data/en_US/champion/${champName}.json`
    return fetch(url)
        .then(response => response.json())
        .then(champDetail => champDetail.data[champName])
        .then(ChampionJsonToObject)
}

function getRegionByChampion(region, champion) {
    for (var key in region) {
        const aux = region[key]
        var aux2 = ''
        aux.map(champ => {
            if (champ === champion) aux2 = key
        })
        if (aux2 != '') return aux2
    }
}


