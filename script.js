const parser = new DOMParser()
const routeFileInput = document.getElementById('route-file-input')
const coursePointList = document.getElementById('course-point-list')

routeFileInput.addEventListener('change', event => {
    const fileList = event.target.files;
    fileList[0].text().then(content => {
        data = parseData(content)
        populateList(data)
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
            if (nameTag == null || latitudeTag == null || longitudeTag == null) {
                return null
            }

            const name = nameTag.textContent
            if (name == '') {
                name = '(empty point)'
            }

            const latitude = parseFloat(latitudeTag.textContent)
            const longitude = parseFloat(longitudeTag.textContent)
            if (isNaN(longitude) || isNaN(latitude)) {
                return null
            }

            return {
                name: name,
                latitude: latitude,
                longitude: longitude,
            }
        })
        .filter(e => e)
}

function populateList(data) {
    data.forEach(point => {
        const listItem = document.createElement('li')
        listItem.textContent = '地点名: '

        const link = document.createElement('a')
        link.href = `https://google.com/maps/@${point.latitude},${point.longitude},15z`
        link.target = '_blank'
        link.textContent = point.name
        listItem.appendChild(link)

        // TODO: bulk insert
        coursePointList.appendChild(listItem)
    })

}