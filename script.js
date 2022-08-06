const parser = new DOMParser()
const routeFileInput = document.getElementById('route-file-input')
const coursePointListContainer = document.getElementById('course-point-list-container')

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
        listItem.textContent = pointTypeIcon(point.type) + ' ' + point.name
        const link = document.createElement('a')
        link.href = `https://google.com/maps/place/${point.latitude},${point.longitude}`
        link.target = '_blank'
        link.textContent = `(${point.longitude}, ${point.latitude})`
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