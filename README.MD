# Education and Population Data Scraper API Documentation

### Overview

This API provides access to population data from Disdukcapil Bontang and educational data from Dapodik. The API scrapes live data from the respective websites and presents it in JSON format. Users can request specific data based on parameters like educational level or geographical area (such as kecamatan).

**BASE URL**

```
http://localhost:3000
```

### Endpoints

**1. Get Population Data**

Fetches population data from Disdukcapil Bontang.

**URL:**

```
/api/population
```

Method:
GET

Response Format:
JSON

Response Example:

```json
{
  "status": "success",
  "populationData": [
    {
      "wilayah": "Bontang Barat",
      "jumlahPenduduk": "45,000"
    },
    {
      "wilayah": "Bontang Utara",
      "jumlahPenduduk": "65,000"
    }
  ]
}
```

**2. Get Educational Data**

Fetches educational data from Dapodik.

**URL:**

```
/api/education
```

Method:
GET

Query Parameters:

    jenjang (optional): Specify the education level you want to retrieve. Example values: sma, sd, smp, etc.
    wilayah (optional): Specify the geographical area or kecamatan for which you want to retrieve data. Example: Bontang Selatan, Bontang Barat.

Example Request:

```
GET http://localhost:3000/api/education?jenjang=sma&wilayah=Bontang Selatan
```

Response Format:
JSON

Response Example:

```
{
  "status": "success",
  "educationData": [
    {
      "wilayah": "Bontang Selatan",
      "sma": {
        "jml": "1200",
        "l": "600",
        "p": "600"
      }
    }
  ]
}
```

How Filtering Works:

Without Parameters: If no parameters are provided, the API returns all educational data across all levels and regions.

With jenjang Parameter: If you provide a specific educational level (e.g., sma), only the data for that level will be returned.

With wilayah Parameter: If you provide a specific region (e.g., Bontang Selatan), only data from that region will be returned.

With Both jenjang and wilayah: If both parameters are provided, the API returns data only for the specified education level in the specified region.

### Detailed Example Usage

1. Fetching Population Data

Request:

```
GET http://localhost:3000/api/population
```

Response:

```
{
  "status": "success",
  "populationData": [
    {
      "wilayah": "Bontang Barat",
      "jumlahPenduduk": "45,000"
    },
    {
      "wilayah": "Bontang Utara",
      "jumlahPenduduk": "65,000"
    }
  ]
}
```

2. Fetching All Education Data

Request:

```
GET http://localhost:3000/api/education
```

Response:

```
{
  "status": "success",
  "educationData": [
    {
      "wilayah": "Bontang Selatan",
      "total": {
        "jml": "5000",
        "l": "2500",
        "p": "2500"
      },
      "tk": {
        "jml": "600",
        "l": "300",
        "p": "300"
      },
      "sma": {
        "jml": "1200",
        "l": "600",
        "p": "600"
      },
      // more data...
    },
    {
      "wilayah": "Bontang Barat",
      "total": {
        "jml": "4500",
        "l": "2200",
        "p": "2300"
      },
      "sma": {
        "jml": "1100",
        "l": "550",
        "p": "550"
      },
      // more data...
    }
  ]
}
```

3. Fetching Only SMA Data from Bontang Selatan

Request:

```
GET http://localhost:3000/api/education?jenjang=sma&wilayah=Bontang Selatan
```

Response:

```
{
  "status": "success",
  "educationData": [
    {
      "wilayah": "Bontang Selatan",
      "sma": {
        "jml": "1200",
        "l": "600",
        "p": "600"
      }
    }
  ]
}
```

### Deploy

Host your own instance of the api on heroku using the button below.

### Vercel

Host your own instance of the api on render using the button below.
