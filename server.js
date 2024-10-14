const express = require("express");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

let browser;

(async () => {
  browser = await puppeteer.launch({ headless: true });
})();

// Endpoint untuk mendapatkan data populasi dari Disdukcapil
app.get("/api/population", async (req, res) => {
  try {
    const populationPage = await browser.newPage();
    await populationPage.goto(
      "https://disdukcapil.bontangkota.go.id/agregat/",
      {
        waitUntil: "networkidle2",
      }
    );

    await populationPage.waitForSelector("table tbody tr", { timeout: 10000 });
    const populationContent = await populationPage.content();
    const $pop = cheerio.load(populationContent);
    const populationData = [];

    $pop("table tbody tr").each((index, element) => {
      const wilayah = $pop(element).find("td").eq(0).text().trim(); // Kolom wilayah
      const jumlahPenduduk = $pop(element).find("td").eq(1).text().trim(); // Kolom jumlah penduduk

      populationData.push({
        wilayah,
        jumlahPenduduk,
      });
    });

    await populationPage.close();

    res.json({
      status: "success",
      populationData,
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat mendapatkan data populasi:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Endpoint untuk mendapatkan data pendidikan dari Dapodik
app.get("/api/education", async (req, res) => {
  try {
    const educationPage = await browser.newPage();
    await educationPage.goto("https://dapo.kemdikbud.go.id/pd/2/166300", {
      waitUntil: "networkidle2",
    });

    await educationPage.waitForSelector("table tbody tr", { timeout: 10000 });
    const educationContent = await educationPage.content();
    const $edu = cheerio.load(educationContent);
    const educationData = [];

    $edu("table tbody tr").each((index, element) => {
      const wilayah = $edu(element).find("td").eq(1).text().trim(); // Kolom Wilayah
      const total = {
        jml: $edu(element).find("td").eq(2).text().trim(),
        l: $edu(element).find("td").eq(3).text().trim(),
        p: $edu(element).find("td").eq(4).text().trim(),
      };

      const tk = {
        jml: $edu(element).find("td").eq(5).text().trim(),
        l: $edu(element).find("td").eq(6).text().trim(),
        p: $edu(element).find("td").eq(7).text().trim(),
      };

      educationData.push({
        wilayah,
        total,
        tk,
      });
    });

    await educationPage.close();

    res.json({
      status: "success",
      educationData,
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat mendapatkan data pendidikan:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

process.on("exit", () => {
  if (browser) {
    browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
