import { Button, Input, Table, DatePicker, Tooltip } from "antd";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";

const { RangePicker } = DatePicker;
const apiUrl = process.env.REACT_APP_WA_BACKEND_API_URL ||  "";

const ReportLogChat: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);

  const [pageSize, setPageSize] = useState(50);
  const [pageNumber, setPageNumber] = useState(1);

  const [phonenumber, setPhonenumber] = useState("");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
   dayjs().startOf("day"), // awal hari ini
    dayjs().endOf("day"),   // akhir hari ini
  ]);

  const fetchChats = async () => {
    setLoading(true);

    try {
      const payload = {
        phonenumber: phonenumber || null,
        startDate: dateRange[0]?.format("YYYY-MM-DD") ?? null,
        endDate: dateRange[1]?.format("YYYY-MM-DD") ?? null,
        pageSize,
        pageNumber,
          types:'Order'
      };

      const { data } = await axios.post(`${apiUrl}/conversation/report`, payload);

      if (data?.data) {
        const mapped = data.data.map((row: any) => ({
          ...row,
          timestamp: dayjs(row.CreatedAt),
          customerNumber: row.phonenumber,
          chat: row.message,
        }));
        setData(mapped);
        setTotalRows(data.count || 0);
      }
    } catch (err) {
      console.error("Error fetching report:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDownloadChats = async () => {
    setLoading(true);

    try {
      const payload = {
        phonenumber: phonenumber || null,
        startDate: dateRange[0]?.format("YYYY-MM-DD") ?? null,
        endDate: dateRange[1]?.format("YYYY-MM-DD") ?? null,
      };

      axios.post(
        `${apiUrl}/conversation/downloadreport`,
        payload,
        { responseType: "blob" }
      ).then(res => {
        const start = payload.startDate ?? "all";
        const end = payload.endDate ?? "all";
        const phone = payload.phonenumber ?? "all";

        // 🔹 Bersihkan filename dari karakter aneh
        const safeFileName = `chat_${start}_${end}_${phone}.xlsx`
          .replace(/[^a-zA-Z0-9._-]/g, "_");

        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = safeFileName;

        document.body.appendChild(link);
        link.click();

        // cleanup
        link.remove();
        window.URL.revokeObjectURL(url);
      });

    } catch (err) {
      console.error("Error fetching report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [pageNumber, pageSize]);

  const handleSearch = () => {
    setPageNumber(1);
    fetchChats();
  };

  const renderChat = (text: string) => {
    if (!text) return "-";
    if (/\.(jpg|jpeg|png|gif)$/i.test(text)) {
      return <img src={text} alt="img" style={{ width: 70, borderRadius: 6 }} />;
    }
    return (
      <Tooltip title={text}>
        {text.length > 30 ? text.substring(0, 30) + "..." : text}
      </Tooltip>
    );
  };

  const columns = [
    {
      title: "Tanggal",
      dataIndex: "timestamp",
      render: (d: Dayjs) => d.format("YYYY-MM-DD HH:mm"),
      width: 150,
      sorter: false,
    },
    { title: "No Customer", dataIndex: "customerNumber", width: 130 },
    { title: "Jenis", dataIndex: "types", width: 100 },
    { title: "Chat", dataIndex: "chat", render: renderChat },
    { title: "From", dataIndex: "direction", width: 120 },
  ];

  return (
    <div style={{ padding: 20, background: "#fff", borderRadius: 8 }}>
      {/* Filter */}
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <Input
          placeholder="Input No HP"
          value={phonenumber}
          onChange={(e) => setPhonenumber(e.target.value)}
          style={{ width: 200 }}
        />

        <RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates as any)}
          style={{ width: 260 }}
        />

        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>

        <Button onClick={fetchChats}>Refresh</Button>
        <Button
          onClick={fetchDownloadChats}
          style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}
        >
          Download
        </Button>


      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        pagination={{
          total: totalRows,
          current: pageNumber,
          pageSize,
          showSizeChanger: true,
          onChange: (page, size) => {
            setPageNumber(page);
            setPageSize(size);
          },
        }}
        bordered
        size="small"
      />
    </div>
  );
};

export { ReportLogChat };
