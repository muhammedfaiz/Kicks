const salesReportHelper = require("../../helpers/salesReportHelper");
const productHelper = require("../../helpers/productHelper");
const moment = require("moment");
const PDFDocument = require("pdfkit");

const generateSalesReport = async (req, res) => {
  try {
    let salesData;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 5;

    if (req.query) {
      const { startDate, endDate } = req.query;
      salesData = await salesReportHelper.getSalesData(startDate, endDate,page,pageSize);
    } else {
      salesData = await salesReportHelper.getSalesData(null,null,page,pageSize);
    }
    for (let data of salesData.orders) {
      data.allTotal = productHelper.currencyFormatter(Math.round(data.total));
      data.orderedDate = moment(data.orderedOn).format("DD-MM-YYYY");
    }
    const totalRevenue = productHelper.currencyFormatter(
      Math.round(salesData.salesSummary.totalRevenue)
    );
    res.render("backend/salesReport", {
      salesData: salesData.orders,
      totalRevenue,
      saleCount: salesData.salesSummary.sales,
    });
  } catch (error) {
    console.log(error);
  }
};

const getSalesData = async (req, res) => {
  try {
    const month = await salesReportHelper.getChartDataPerMonth();
    const year = await salesReportHelper.getChartDataPerYear();
    res.json({ month, year });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { generateSalesReport, getSalesData };
