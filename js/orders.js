const inputContainer = document.getElementById("input-container");
const input = document.getElementById("input");
const tableContainer = document.getElementById("table-container");
const pageText = document.getElementById("page-container");
const pageTotalText = document.getElementById("total-page-container");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const Auth = new Authentication();
const OrdersService = new Orders();

let totalPage;
let currentPage = 1;

window.onload = async () => {
  Auth.checkAuthenticated();

  const { status, data } = await OrdersService.getOrdersData(currentPage);

  if (status) {
    const { orders, page, total } = data;
    currentPage = page;
    totalPage = Math.ceil(total / orders?.length);
    populateTable(orders);
    pageText.innerText = currentPage;
    pageTotalText.innerText = totalPage;
    if (currentPage == 1) {
      prevBtn.classList.add("hidden");
    }
    if (totalPage == currentPage) {
      nextBtn.classList.add("hidden");
    }
  }
};

function populateTable(tableData) {
  tableData?.forEach((data) => {
    tableContainer.innerHTML += `
        <tr>
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">${
              data?.product?.name
            } </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${dayjs(
              data?.created_at
            ).format("DD MM YYYY HH:mm A")}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${
              data?.currency
            } ${data?.total}</td>
            <td class=${
              "whitespace-nowrap px-3 py-4 text-sm capitalize text-gray-500 " +
              `status_${data.status}`
            }>${data.status} </td>
            
            </tr>
        `;
  });
}

inputContainer.addEventListener("submit", async (e) => {
  e.preventDefault();
  const searchValue = input.value;

  if (searchValue?.length) {
    const { status, data } = await OrdersService.getOrdersData(1, searchValue);

    if (status) {
      const { orders, page, total } = data;
      tableContainer.innerHTML = "";
      currentPage = page;
      totalPage = Math.ceil(total / orders?.length);
      populateTable(orders);
      if (currentPage == 1) {
        prevBtn.classList.add("hidden");
      }
      if (totalPage == currentPage) {
        nextBtn.classList.add("hidden");
      }
    }
  }
});

async function paginate(type = "increase") {
  let status, data;
  const searchValue = input?.value;

  if (type == "increase") {
    const response = await OrdersService.getOrdersData(
      currentPage + 1,
      searchValue
    );

    status = response.status;
    data = response.data;
  } else {
    const response = await OrdersService.getOrdersData(
      currentPage - 1,
      searchValue
    );

    status = response.status;
    data = response.data;
  }

  if (status) {
    const { orders, page, total } = data;
    tableContainer.innerHTML = "";
    currentPage = page;
    totalPage = Math.ceil(total / orders?.length);
    populateTable(orders);
    pageText.innerText = currentPage;
    pageTotalText.innerText = totalPage;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (currentPage == 1) {
      prevBtn.classList.add("hidden");
    } else {
      prevBtn.classList.remove("hidden");
    }
    if (totalPage == currentPage) {
      nextBtn.classList.add("hidden");
    } else {
      nextBtn.classList.remove("hidden");
    }
  }
}

prevBtn.addEventListener("click", async () => await paginate("decrease"));
nextBtn.addEventListener("click", async () => await paginate("increase"));
