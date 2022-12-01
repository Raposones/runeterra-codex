const champList = document.getElementById('championList')
const loading = document.getElementById('loading')
const classFilter = document.querySelector('.filter .class-filter')
const regionFilter = document.querySelector('.filter .region-filter')
const filter = document.querySelector('.filter')
const loadMore = document.getElementById('load-more')

const classList = ['Assassin', 'Fighter', 'Mage', 'Marksman', 'Support', 'Tank']
const regionList = ['BandleCity', 'Bilgewater', 'Demacia', 'Ionia', 'Ixtal', 'Noxus', 'Piltover', 'ShadowIsles', 'Shurima', 'Targon', 'Freljord', 'Void', 'Zaun', 'Runeterra']
let isFiltering = 0
let chunkIndex = 0


classList.map(classType => classFilter.innerHTML += `<li><button class="class-button" type="button">${classType}</button></li>`)
regionList.map(region => regionFilter.innerHTML += `<li><button class="region-button" type="button">${region}</button></li>`)


function getChampionsByRegion(region) {
	getAPI.getChampions(1)
		.then(fullList => fullList.map(champ => {
			var champName = Object.keys(champ)[0]
			return getAPI.getChampionDetails(champName, '', region)
		}))
		.then(detailRequest => Promise.all(detailRequest))
		.then(filteredList => filteredList.map(champ => {
			if (champ != undefined) showChampion(champ)
		}))
		.catch(err => console.log(err))
}

function getChampionsByClass(classType) {
	getAPI.getChampions(1)
		.then(fullList => fullList.map(champ => {
			var champName = Object.keys(champ)[0]
			return getAPI.getChampionDetails(champName, classType, '')
		}))
		.then(detailRequest => Promise.all(detailRequest))
		.then(filteredList => filteredList.map(champ => {
			if (champ != undefined) showChampion(champ)
		}))
		.catch(err => console.log(err))
}



function getChampionsList(chunkInd) {
	getAPI.getChampions()
		.then(fullList => fullList[chunkInd].map(champ => {
			var champName = Object.keys(champ)[0]
			const details = getAPI.getChampionDetails(champName)
			return details
		}))
		.then(detailRequest => Promise.all(detailRequest))
		.then(champDetails => champDetails.map(showChampion))
		.catch(err => console.log(err))
}

function showChampion(champion) {
	const newHTML = `
		<li onclick=showDetails('${champion.name}') class="champion ${champion.region}">
			<div class="classList">
				<ol class="classes">
					${champion.class.map(roleClass => `<li><img class="classIcon" src="resources/class/${roleClass}.webp" alt="class"></li>`).join('')}
				</ol>
			</div>
			<div class="iconDiv">
				<img class="icon" src="resources/champion_sprites/${champion.icon}" alt="${champion.icon}">
			</div>
			<span class="name">${champion.name}</span>
			<span class="title">${champion.title}</span>
				<ol class="skills">
					<li><img class="passive" src="resources/passive/${champion.skills[0]}" alt="P"></li>
					<li><img src="resources/spell/${champion.skills[1]}" alt="Q"></li>
					<li><img src="resources/spell/${champion.skills[2]}" alt="W"></li>
					<li><img src="resources/spell/${champion.skills[3]}" alt="E"></li>
					<li><img src="resources/spell/${champion.skills[4]}" alt="R"></li>
				</ol>
		</li>`
	champList.innerHTML += newHTML
}

function showDetails(champDets) {
	getAPI.getChampionDetails(champDets).then(champion => {
		const details = document.getElementById('modal-details')

		document.querySelector('.modal').style.backgroundImage = `linear-gradient(to bottom, rgba(7, 11, 37, 0.7) 100%, rgba(5, 7, 23, 0.9) 100%), url(resources/champion_splash/${champion.name}_0.jpg`
		document.querySelector('.modal #iconDiv').innerHTML = `<img id="icon" src="resources/champion_sprites/${champion.icon}" alt="${champion.icon}">`
		document.querySelector('.modal #name').innerHTML = champion.name
		document.querySelector('.modal #title').innerHTML = champion.title
		document.querySelector('.modal #class').innerHTML = champion.class.map(roleClass => `  ${roleClass} <img src="resources/class/${roleClass}.webp">  `).join('|')

		document.querySelector('.modal #region').innerHTML = `<span id=${champion.region}>${champion.region}</span> <img src="resources/regions/${champion.region}_icon.png">`
		document.querySelector('.modal #desc').innerHTML = `${champion.desc}`


		/* 		var classList = document.querySelector('.modal #classList #classes')
				classList.innerHTML = champion.class.map((classRole) => `<li>${classRole}</li>`) */

		details.classList.add('show')
		details.addEventListener('click', (e) => {
			if (e.target.id == 'modal-details' || e.target.className == 'closeButton') {
				details.classList.remove('show')
			}
		})
	})
}

getChampionsList(chunkIndex)


regionFilter.addEventListener('click', e => {
	if (e.target.type == 'button') {
		loadMore.style.visibility = 'hidden'
		var region = e.target.innerText
		champList.innerHTML = ''
		getChampionsByRegion(region)
	}
})

classFilter.addEventListener('click', e => {
	if (e.target.type == 'button') {
		loadMore.style.visibility = 'hidden'
		var classType = e.target.innerText
		champList.innerHTML = ''
		getChampionsByClass(classType)
	}
})

filter.addEventListener('click', e =>{
	if(e.target.innerText == 'Show all'){
		loadMore.style.visibility = 'visible'
		champList.innerHTML = ''
		chunkIndex = 0
		getChampionsList(chunkIndex)
	}
})

loadMore.addEventListener('click', e => {
	chunkIndex++
	getChampionsList(chunkIndex)
})







