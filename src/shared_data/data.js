var categoryArray = [
    ['food', '4d4b7105d754a06374d81259'],
    ['physicians', '4bf58dd8d48988d104941735'],
    ['autorepair', '56aa371be4b08b9a8d5734d3'],
    ['hotels', '4bf58dd8d48988d1fa931735'],
    ['servicestations', '4bf58dd8d48988d113951735']
];

export function getCategories(category) {
    var keys = Object.keys(category);

    var filteredKeys = keys.filter(function(key) {
        return category[key] && key != "__typename";
    });

    var categoryMap = new Map(categoryArray);

    var yelpCategories = "";
    var foursquareCategories = "";

    filteredKeys.forEach(function(key) {
        if (yelpCategories != "") {
            yelpCategories += ",";
            foursquareCategories += ",";
        } 
        yelpCategories += key;
        foursquareCategories += categoryMap.get(key);
    })

    var categories = {
        yelpCategories: yelpCategories,
        foursquareCategories: foursquareCategories
    }; 
    return categories;
}