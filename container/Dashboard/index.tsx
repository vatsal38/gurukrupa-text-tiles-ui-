import React from "react";
import Layout from "../Layout";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import dashboardServices from "@/services/Apis/dashboard";
import { useQuery } from "react-query";
import { useRouter } from "next/router";

export default function DashBoard() {
  const router = useRouter();

  const dashboardDataKey = "/dashboards";

  const {
    data: dashboardData,
    isLoading: isDashboardsLoading,
    refetch: refetchDashboard,
  }: any = useQuery(
    [dashboardDataKey],
    dashboardServices.getAllDashboardCount,
    {
      refetchOnWindowFocus: false,
      keepPreviousData: false,
    }
  );

  const countArray = [
    {
      name: "Agent",
      itemCount: dashboardData?.agentCount,
      buttonName: "View Agent",
      href: "/agents",
    },
    {
      name: "Buyer",
      itemCount: dashboardData?.buyerCount,
      buttonName: "View Buyer",
      href: "/buyers",
    },
    {
      name: "Machine",
      itemCount: dashboardData?.machineCount,
      buttonName: "View Machine",
      href: "/machines",
    },
    {
      name: "Seller",
      itemCount: dashboardData?.sellerCount,
      buttonName: "View Seller",
      href: "/sellers",
    },
    {
      name: "Worker",
      itemCount: dashboardData?.workerCount,
      buttonName: "View Worker",
      href: "/workers",
    },
  ];
  return (
    <Layout>
      <Typography
        variant="h4"
        sx={{ fontWeight: 600, mb: 4, color: "#2B3743" }}
      >
        Dashboard
      </Typography>
      <div className="grid grid-cols-3 gap-8 max-w-7xl">
        {isDashboardsLoading ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress />
          </div>
        ) : (
          countArray?.map((item: any, index: any) => (
            <Card
              sx={{ minWidth: 275, border: "1px solid #E5E5E7", maxWidth: 400 }}
              key={index}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 500, fontFamily: "unset", mb: 1 }}
                >
                  Total {item?.name}
                </Typography>
                <Typography variant="h5" color="#A0A0A2">
                  {item?.itemCount}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  sx={{ fontWeight: 500 }}
                  onClick={() => router.push(item?.href)}
                >
                  {item?.buttonName}
                </Button>
              </CardActions>
            </Card>
          ))
        )}
      </div>
    </Layout>
  );
}
