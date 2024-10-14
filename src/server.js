const express = require("express");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

let browser;

(async () => {
  // Meluncurkan browser Puppeteer sekali di awal
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
    const { jenjang, wilayah } = req.query; // Mengambil query parameters jika ada
    const educationPage = await browser.newPage();
    await educationPage.goto("https://dapo.kemdikbud.go.id/pd/2/166300", {
      waitUntil: "networkidle2",
    });

    await educationPage.waitForSelector("table tbody tr", { timeout: 10000 });
    const educationContent = await educationPage.content();
    const $edu = cheerio.load(educationContent);
    const educationData = [];

    $edu("table tbody tr").each((index, element) => {
      const dataWilayah = $edu(element).find("td").eq(1).text().trim(); // Kolom Wilayah
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

      const kb = {
        jml: $edu(element).find("td").eq(8).text().trim(),
        l: $edu(element).find("td").eq(9).text().trim(),
        p: $edu(element).find("td").eq(10).text().trim(),
      };

      const tpa = {
        jml: $edu(element).find("td").eq(11).text().trim(),
        l: $edu(element).find("td").eq(12).text().trim(),
        p: $edu(element).find("td").eq(13).text().trim(),
      };

      const sps = {
        jml: $edu(element).find("td").eq(14).text().trim(),
        l: $edu(element).find("td").eq(15).text().trim(),
        p: $edu(element).find("td").eq(16).text().trim(),
      };

      const pkbm = {
        jml: $edu(element).find("td").eq(17).text().trim(),
        l: $edu(element).find("td").eq(18).text().trim(),
        p: $edu(element).find("td").eq(19).text().trim(),
      };

      const skb = {
        jml: $edu(element).find("td").eq(20).text().trim(),
        l: $edu(element).find("td").eq(21).text().trim(),
        p: $edu(element).find("td").eq(22).text().trim(),
      };

      const sd = {
        jml: $edu(element).find("td").eq(23).text().trim(),
        l: $edu(element).find("td").eq(24).text().trim(),
        p: $edu(element).find("td").eq(25).text().trim(),
      };

      const smp = {
        jml: $edu(element).find("td").eq(26).text().trim(),
        l: $edu(element).find("td").eq(27).text().trim(),
        p: $edu(element).find("td").eq(28).text().trim(),
      };

      const sma = {
        jml: $edu(element).find("td").eq(29).text().trim(),
        l: $edu(element).find("td").eq(30).text().trim(),
        p: $edu(element).find("td").eq(31).text().trim(),
      };

      const smk = {
        jml: $edu(element).find("td").eq(32).text().trim(),
        l: $edu(element).find("td").eq(33).text().trim(),
        p: $edu(element).find("td").eq(34).text().trim(),
      };

      const slb = {
        jml: $edu(element).find("td").eq(35).text().trim(),
        l: $edu(element).find("td").eq(36).text().trim(),
        p: $edu(element).find("td").eq(37).text().trim(),
      };

      educationData.push({
        wilayah: dataWilayah,
        total,
        tk,
        kb,
        tpa,
        sps,
        pkbm,
        skb,
        sd,
        smp,
        sma,
        smk,
        slb,
      });
    });

    await educationPage.close();

    // Filter data berdasarkan query parameters jika ada
    let filteredData = educationData;

    // Filter berdasarkan wilayah
    if (wilayah) {
      filteredData = filteredData.filter((data) =>
        data.wilayah.toLowerCase().includes(wilayah.toLowerCase())
      );
    }

    // Filter berdasarkan jenjang pendidikan, misalnya 'sma'
    if (jenjang) {
      filteredData = filteredData.map((data) => {
        // Jika jenjang yang diminta adalah 'sma', maka hanya tampilkan data SMA saja
        if (jenjang.toLowerCase() === "sma") {
          return {
            wilayah: data.wilayah,
            sma: data.sma,
          };
        }
        return data;
      });
    }

    res.json({
      status: "success",
      educationData: filteredData,
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat mendapatkan data pendidikan:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Pastikan browser ditutup saat aplikasi berhenti
process.on("exit", () => {
  if (browser) {
    browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
