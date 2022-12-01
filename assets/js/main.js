const champList = document.getElementById('championList')
let chunkIndex = 0
const loading = document.getElementById('loading')

function getChampionsList(chunkInd){
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
		document.querySelector('.modal .details #desc').innerHTML = `${champion.desc}`


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

addEventListener('scroll', e => {

	if (chunkIndex < 10){
		 if (window.innerHeight + Math.round(window.pageYOffset) === document.documentElement.scrollHeight){
			chunkIndex++
			getChampionsList(chunkIndex)
		}
	}
	else{
		loading.innerHTML = ' '
	}
})




