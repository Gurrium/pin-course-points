const parser = new DOMParser()
const routeFileInput = document.getElementById('route-file-input')
const coursePointListContainer = document.getElementById('course-point-list-container')
const filterFieldset = document.getElementById('filters')
const pointTypeIcons = {
    'Generic': {
        class: 'generic',
        label: 'Generic',
        icon: '⛳️',
    },
    'Summit': {
        class: 'summit',
        label: 'Summit',
        icon: '🏔',
    },
    'Valley': {
        class: 'Valley',
        label: 'Valley',
        icon: '⾕',
    },
    'Water': {
        class: 'Water',
        label: 'Water',
        icon: '🍵',
    },
    'Food': {
        class: 'Food',
        label: 'Food',
        icon: '🍱',
    },
    'Danger': {
        class: 'danger',
        label: 'Danger',
        icon: '⚠️',
    },
    'Left': {
        class: 'Left',
        label: 'Left',
        icon: '⬅️',
    },
    'Right': {
        class: 'right',
        label: 'Right',
        icon: '➡️',
    },
    'Straight': {
        class: 'straight',
        label: 'Straight',
        icon: '⬆️',
    },
    'First Aid': {
        class: 'first-aid',
        label: 'First Aid',
        icon: '🍙',
    },
    '4th Category': {
        class: '4th-category',
        label: '4th Category',
        icon: '4️⃣',
    },
    '3rd Category': {
        class: '3rd-category',
        label: '3rd Category',
        icon: '🥉',
    },
    '2nd Category': {
        class: '2nd-category',
        label: '2nd Category',
        icon: '🥈',
    },
    '1st Category': {
        class: '1st-category',
        label: '1st Category',
        icon: '🥇',
    },
    'Hors Category': {
        class: 'hors-category',
        label: 'Hors Category',
        icon: '🏆',
    },
    'Sprint': {
        class: 'sprint',
        label: 'Sprint',
        icon: '🚴💨',
    },

}

// TODO: pointTypeIconsの内、キーにスペースがあるとinvalidなクラスになる問題を修正する
Object.entries(pointTypeIcons).forEach(([key, value]) => {
    let input = document.createElement('input')
    input.id = key.replace(' ', '_').toLowerCase()
    input.type = 'checkbox'
    input.checked = true
    input.addEventListener('change', event => {
        if (event.target.checked) {
            coursePointListContainer
                .querySelectorAll(`li.${key}`)
                .forEach(li => {
                    li.classList.remove('hidden')
                })
        } else {
            coursePointListContainer
                .querySelectorAll(`li.${key}`)
                .forEach(li => {
                    li.classList.add('hidden')
                })
        }
    })

    let label = document.createElement('label')
    label.htmlFor = input.id
    label.textContent = `${value} ${key}`

    let div = document.createElement('div')
    div.appendChild(input)
    div.appendChild(label)

    filterFieldset.appendChild(div)
})

routeFileInput.addEventListener('change', event => {
    const fileList = event.target.files;
    fileList[0].text().then(content => {
        data = parseData(content)
        updateList(data)
    })
})

function parseData(content) {
    const doc = parser.parseFromString(content, 'text/xml')
    const coursePointTags = [...doc.getElementsByTagName('CoursePoint')]
    return coursePointTags
        .map(tag => {
            const nameTag = tag.querySelector('Name')
            const latitudeTag = tag.querySelector('LatitudeDegrees')
            const longitudeTag = tag.querySelector('LongitudeDegrees')
            const pointTypeTag = tag.querySelector('PointType')
            const notesTag = tag.querySelector('Notes')

            if (
                ![
                    nameTag,
                    latitudeTag,
                    longitudeTag
                ]
                    .every(e => e != null)
            ) {
                return null
            }

            const name = nameTag.textContent
            const latitude = parseFloat(latitudeTag.textContent)
            const longitude = parseFloat(longitudeTag.textContent)
            if (isNaN(longitude) || isNaN(latitude)) {
                return null
            }
            const type = pointTypeTag != null ? pointTypeTag.textContent : ''
            const notes = notesTag != null ? notesTag.textContent : ''

            return {
                name: name,
                latitude: latitude,
                longitude: longitude,
                type: type,
                notes: notes,
            }
        })
        .filter(e => e)
}

function updateList(data) {
    [...coursePointListContainer.children]
        .forEach(child => coursePointListContainer.removeChild(child))

    const coursePointList = document.createElement('ul')

    data.forEach(point => {
        const listItem = document.createElement('li')
        listItem.classList.add(point.type)
        listItem.textContent = pointTypeIcon(point.type) + ' ' + point.name + ': '
        const link = document.createElement('a')
        link.href = `https://google.com/maps/place/${point.latitude},${point.longitude}`
        link.target = '_blank'
        link.textContent = `${point.longitude}, ${point.latitude}`
        listItem.appendChild(link)

        const nestedListItem = document.createElement('li')
        nestedListItem.textContent = point.notes
        const nestedList = document.createElement('ul')
        nestedList.appendChild(nestedListItem)

        // TODO: bulk insert
        coursePointList.appendChild(listItem)
        coursePointList.appendChild(nestedList)
    })

    coursePointListContainer.appendChild(coursePointList)
}

// TODO: pointTypeIconsを使うようにしてこっちは消す
function pointTypeIcon(pointType) {
    switch (pointType) {
        case 'Generic':
            return '⛳️'
        case 'Summit':
            return '🏔'
        case 'Valley':
            return '⾕'
        case 'Water':
            return '🍵'
        case 'Food':
            return '🍱'
        case 'Danger':
            return '⚠️'
        case 'Left':
            return '⬅️'
        case 'Right':
            return '➡️'
        case 'Straight':
            return '⬆️'
        case 'First Aid':
            return '🍙'
        case '4th Category':
            return '4️⃣'
        case '3rd Category':
            return '🥉'
        case '2nd Category"':
            return '🥈'
        case '1st Category':
            return '🥇'
        case 'Hors Category':
            return '🏆'
        case 'Sprint':
            return '🚴💨'
    }
}