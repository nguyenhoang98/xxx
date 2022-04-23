import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import tw from "twin.macro";
import { useLocalStorageState } from "utils/useLocalStorageState";
import Logo from "components/Logo";
import PageSearch from "components/PageSearch";
import { Layout, Menu, Spin, Dropdown, Avatar } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "contexts/auth-context";
import { menuRoutes } from "api/menuRoutes";

const { SubMenu } = Menu;
const { Header, Sider, Content } = Layout;

export default function AppLayout({ children }) {
  const router = useRouter();
  const { logout, userInfo } = useAuth();
  const [collapsed, setCollapsed] = useLocalStorageState("collapsed", false);
  const [pageLoading, setPageLoading] = useState(false);
  const headerDropdownMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={logout}>
        <LogoutOutlined className="mr-2" />
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const onCollapse = () => setCollapsed(!collapsed);
  const onLoad = () => setPageLoading(true);
  const onDone = () => setPageLoading(false);

  useEffect(() => {
    router.events.on("routeChangeStart", onLoad);
    router.events.on("routeChangeComplete", onDone);
    router.events.on("routeChangeError", onDone);

    return () => {
      router.events.off("routeChangeStart", onLoad);
      router.events.off("routeChangeComplete", onDone);
      router.events.off("routeChangeError", onDone);
    };
  }, []);

  const renderMenu = (menuItem) => {
    return (
      <Menu.Item key={menuItem.path} onClick={() => router.push(menuItem.path)}>
        {menuItem.title}
      </Menu.Item>
    );
  };

  const renderSubMenu = (subMenu) => {
    return (
      <SubMenu key={subMenu.key} icon={subMenu.icon} title={subMenu.title}>
        {subMenu.menuItems.map((menuItem) => {
          return renderMenu(menuItem);
        })}
      </SubMenu>
    );
  };

  return (
    <Layout className="flex flex-col w-full min-h-full">
      <Header className="h-12 bg-transparent" />
      <Header className="fixed top-0 z-20 flex items-center justify-between w-full h-12 px-5 py-0">
        <Logo />
        <PageSearch />
        <HeaderDropdown>
          <Dropdown overlay={headerDropdownMenu} placement="bottomRight">
            <div className="flex items-center">
              <Avatar icon={<UserOutlined />} />
              <span className="ml-2">{userInfo.fullName}</span>
            </div>
          </Dropdown>
        </HeaderDropdown>
      </Header>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          defaultCollapsed={collapsed}
          onCollapse={onCollapse}
          collapsedWidth={48}
          className="fixed top-0 left-0 z-10 h-full pt-12 overflow-auto overflow-x-hidden"
        >
          <div
            style={{
              flex: "1 1 0%",
              overflow: "hidden auto",
            }}
          >
            <Menu mode="inline" selectedKeys={[router.pathname]}>
              {menuRoutes.map((subMenu) => {
                return subMenu.menuItems
                  ? renderSubMenu(subMenu)
                  : renderMenu(subMenu);
              })}
            </Menu>
          </div>
        </Sider>
        <Layout className="flex">
          <Sider
            collapsible
            collapsed={collapsed}
            defaultCollapsed={collapsed}
            collapsedWidth={48}
            className="invisible"
          />
          <Content>
            <Spin className="mt-20" size="large" spinning={pageLoading}>
              {children}
            </Spin>
          </Content>
          {/* <Footer className="flex items-center justify-center p-6 text-gray-400"> */}
          {/*  Copyright&nbsp; */}
          {/*  <CopyrightOutlined /> */}
          {/*  &nbsp;2020. VNDIRECT Securities Corp */}
          {/* </Footer> */}
        </Layout>
      </Layout>
    </Layout>
  );
}

const HeaderDropdown = styled.div`
  ${tw`flex text-white`}
  & {
    .ivnd-dropdown-trigger {
      ${tw`px-2 transition-all duration-300`}
    }
    .ivnd-dropdown-trigger:hover {
      ${tw`cursor-pointer `}
      background-color: #1E293B;
    }
    .ivnd-dropdown-open {
      background-color: #1e293b;
    }
  }
`;
