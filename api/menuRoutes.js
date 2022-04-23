import {
  FileDoneOutlined,
  AuditOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

export const menuRoutes = [
  {
    key: "product",
    icon: <AppstoreOutlined />,
    title: "Product management",
    menuItems: [
      {
        path: "/product/list",
        title: "Product list",
        code: "SP001",
        label: "Danh sách sản phẩm",
      },
      {
        path: "/product/create",
        title: "Create new",
        code: "SP002",
        label: "Tạo sản phẩm",
      },
      {
        path: "/product/category",
        title: "Category List",
        code: "SP000",
        label: "Product category list",
      },
    ],
  },
  {
    key: "policy",
    icon: <AuditOutlined />,
    title: "Policy management",
    menuItems: [
      {
        path: "/policy/list",
        title: "Policy list",
        code: "CS000",
        label: "Danh sách chính sách",
      },
      {
        path: "/policy/create",
        title: "Create new",
        code: "CS003",
        label: "Tạo chính sách",
      },
    ],
  },
  {
    key: "report",
    icon: <FileDoneOutlined />,
    title: "Báo cáo",
    menuItems: [
      {
        path: "/report/commission",
        title: "Hoa hồng",
        code: "BC001",
        label: "Báo cáo hoa hồng phái sinh theo từng môi giới",
      },
      {
        path: "/report/revenue",
        title: "Doanh thu",
        code: "BC002",
        label: "Báo cáo doanh thu tài khoản careby theo môi giới",
      },
      {
        path: "/report/adjustment",
        title: "Điều chỉnh",
        code: "DC001",
        label: "Chốt kì tính toán điều chỉnh",
      },
    ],
  },
];

const getMenuPath = (route) => {
  // console.log(route);
  return menuRoutes.filter((item) => {
    if (route.includes(item.key)) return item;
    return null;
  })[0];
};

export const getRouteInfo = (route) => {
  const { menuItems } = getMenuPath(route);
  return menuItems.filter((item) => {
    if (item.path === route) return item;
    return null;
  })[0];
};
