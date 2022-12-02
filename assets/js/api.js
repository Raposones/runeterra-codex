
const getAPI = {};
const regions = {
    'BandleCity': ['Corki', 'Lulu', 'Rumble', 'Veigar', 'Yuumi', 'Teemo', 'Tristana'],
    'Bilgewater': ['Pyke', 'Nilah', 'Fizz', 'Nautilus', 'Gangplank', 'Graves', 'Illaoi', 'MissFortune', 'TahmKench', 'TwistedFate'],
    'Demacia': ['Fiora', 'Garen', 'Galio', 'JarvanIV', 'Kayle', 'Lucian', 'Lux', 'Morgana', 'Poppy', 'Quinn', 'Shyvana', 'Sona', 'Sylas', 'Vayne', 'XinZhao'],
    'Ionia': ['Jhin', 'Ivern', 'Irelia', 'Karma', 'Kayn', 'Kennen', 'LeeSin', 'Lillia', 'MasterYi', 'MonkeyKing', 'Rakan', 'Sett', 'Shen', 'Syndra', 'Varus', 'Xayah', 'Yasuo', 'Yone', 'Zed', 'Ahri', 'Akali'],
    'Ixtal': ['Malphite', 'Neeko', 'Nidalee', 'Qiyana', 'Rengar', 'Zyra'],
    'Noxus': ['Rell', 'Cassiopeia', 'Darius', 'Draven', 'Katarina', 'Kled', 'Leblanc', 'Mordekaiser', 'Riven', 'Samira', 'Sion', 'Swain', 'Talon', 'Vladimir'],
    'Piltover': ['Caitlyn', 'Camille', 'Ezreal', 'Heimerdinger', 'Jayce', 'Orianna', 'Seraphine', 'Vi'],
    'ShadowIsles': ['Elise', 'Gwen', 'Hecarim', 'Kalista', 'Karthus', 'Maokai', 'Thresh', 'Vex', 'Viego', 'Yorick'],
    'Shurima': ['Akshan', 'Amumu', 'Azir', 'Nasus', 'Rammus', 'Renekton', 'Rengar', 'Sivir', 'Skarner', 'Taliyah', 'Xerath', 'KSante'],
    'Targon': ['Aphelios', 'AurelionSol', 'Diana', 'Leona', 'Pantheon', 'Soraka', 'Taric', 'Zoe'],
    'Freljord': ['Anivia', 'Ashe', 'Braum', 'Gnar', 'Gragas', 'Lissandra', 'Nunu', 'Olaf', 'Ornn', 'Sejuani', 'Trundle', 'Tryndamere', 'Udyr', 'Volibear'],
    'Void': ['Belveth', 'Chogath', 'Kaisa', 'Kassadin', 'Khazix', 'KogMaw', 'Malzahar', 'RekSai', 'Velkoz'],
    'Zaun': ['Blitzcrank', 'DrMundo', 'Ekko', 'Janna', 'Jinx', 'Renata', 'Singed', 'Twitch', 'Urgot', 'Viktor', 'Warwick', 'Zac', 'Ziggs', 'Zeri'],
    'Runeterra': ['Zilean', 'Shaco', 'Senna', 'Ryze', 'Nocturne', 'Nami', 'Kindred', 'Jax', 'Fiddlesticks', 'Evelynn', 'Brand', 'Bard', 'Annie', 'Aatrox', 'Ahri', 'Alistar',]
}


function ChampionJsonToObject(champData, classSearch = '', regionSearch = '') {
    const classList = champData.tags.map((champClass) => champClass)
    const champName = champData.id
    const champRegion = getRegionByChampion(champName)

    if (classSearch != '') {
        if (!classList.includes(classSearch)) return
    }

    if (regionSearch != '') {
        if (champRegion != regionSearch) return
    }

    const champ = new Champion()
    champ.name = champName
    champ.title = champData.title
    champ.desc = champData.lore
    champ.icon = champData.image.full

    const passive = champData.passive.image.full
    const spellsList = champData.spells.map(num => num.image.full)
    let spells = [passive]
    spells = spells.concat(spellsList)
    champ.skills = spells

    champ.class = classList

    champ.region = champRegion

    return champ
}


getAPI.getChampions = (fullList = 0) => {
    const url = `https://ddragon.leagueoflegends.com/cdn/12.22.1/data/en_US/champion.json`
    if (!fullList) {
        //Return all champions in chunks of 16
        return fetch(url)
            .then(response => response.json())
            .then(jsonBody => jsonBody.data)
            .then(champsDict => Object.entries(champsDict).map(([key, value]) => ({ [key]: value })))
            .then(champs => {
                var chunks = []
                var chunkSize = 16
                for (let i = 0; i < champs.length; i += chunkSize) {
                    const chunk = champs.slice(i, i + chunkSize);
                    chunks.push(chunk);
                }
                return chunks
            })
            .catch(err => console.error(err));
    }
    else{
        return fetch(url)
            .then(response => response.json())
            .then(jsonBody => jsonBody.data)
            .then(champsDict => Object.entries(champsDict).map(([key, value]) => ({ [key]: value })))
            .then(result => result)
            .catch(err => console.log(err))
    }
}

getAPI.getChampionDetails = (champName, classFilter = '', regionFilter = '') => {
    const url = `https://ddragon.leagueoflegends.com/cdn/12.22.1/data/en_US/champion/${champName}.json`
    return fetch(url)
        .then(response => response.json())
        .then(champDetail => champDetail.data[champName])
        .then(details => ChampionJsonToObject(details, classFilter, regionFilter))
        .catch(err => {
            alert("Champion not found!")
        })
}

function getRegionByChampion(champion) {
    for (var key in regions) {
        const aux = regions[key]
        var aux2 = ''
        aux.map(champ => {
            if (champ === champion) aux2 = key
        })
        if (aux2 != '') return aux2
    }
}



