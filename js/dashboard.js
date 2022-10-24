const todayData = document.getElementById("today-data");
const weekData = document.getElementById("week-data");
const monthData = document.getElementById("month-data");
const bestsellerTable = document.getElementById("bestseller-table");
const toggle = document.getElementById("toggle");
const chartTittle = document.getElementById("chart-title");

const Auth = new Authentication();
const DashboardService = new Dashboard();

let dashboardData;

window.onload = async () => {
  Auth.checkAuthenticated();

  const { status, data } = await DashboardService.getDashboardData();

  dashboardData = data?.dashboard;

  if (status) {
    const { bestsellers, sales_over_time_week, sales_over_time_year } =
      data?.dashboard;

    todayData.textContent = `$${sales_over_time_week?.["1"]?.total} / ${sales_over_time_week?.["1"]?.orders} orders`;

    const totalWeekSale = Object.values(sales_over_time_week)?.reduce(
      (prev, current) => {
        return prev + current.total;
      },
      0
    );
    const totalOrderWeekly = Object.values(sales_over_time_week)?.reduce(
      (prev, current) => {
        return prev + current.orders;
      },
      0
    );

    weekData.textContent = `$${totalWeekSale} / ${totalOrderWeekly} orders`;

    const totalMonthSale = Object.values(sales_over_time_year)?.reduce(
      (prev, current) => {
        return prev + current.total;
      },
      0
    );
    const totalOrderMonthly = Object.values(sales_over_time_year)?.reduce(
      (prev, current) => {
        return prev + current.orders;
      },
      0
    );

    monthData.textContent = `$${totalMonthSale} / ${totalOrderMonthly} orders`;
    createChart(sales_over_time_week);
    populateBestsellers(bestsellers);
  }
};

function populateBestsellers(bestseller) {
  bestseller?.forEach((seller) => {
    bestsellerTable.innerHTML += `
        <tr>
        <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">${seller?.product?.name}</td>
        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${seller?.units}</td>
        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${seller?.revenue}</td>
        
      </tr>
        `;
  });
}

function toggleChart() {
  const isWeekly = toggle.checked;
  if (!isWeekly) {
    chartTittle.textContent = "Revenue (last 7 days)";
    createChart(dashboardData?.sales_over_time_week);
  } else {
    chartTittle.textContent = "Revenue (last 12 months)";
    createChart(dashboardData?.sales_over_time_year, "Month");
  }
}

toggle.addEventListener("change", toggleChart);
