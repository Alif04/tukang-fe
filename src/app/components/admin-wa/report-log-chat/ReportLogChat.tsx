import { Button, Input, Table, DatePicker, Tooltip } from 'antd';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import React, { useEffect, useState } from 'react';

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;
const apiUrl = process.env.REACT_APP_API_CHAT_URL;

const ReportLogChat: React.FC = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filteredChats, setFilteredChats] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [search, setSearch] = useState('');

  const fetchChats = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${apiUrl}/all-chat-assign2`);
      if (data.success) {
        const mappedChats = data.chats.map((chat: any) => ({
          id: chat._id,
          customerNumber: chat.chatId.replace(/@c\.us$/, ''), // Hapus '@c.us'
          chatId: chat.chatId,
          chat: chat.message,
          timestamp: dayjs(chat.timestamp), // KONVERSI ke Day.js object
        }));
        setChats(mappedChats);
        setFilteredChats(mappedChats);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // Filter data berdasarkan nomor customer & rentang tanggal
  useEffect(() => {
    let filtered = chats;

    // Filter berdasarkan nomor customer
    if (search) {
      filtered = filtered.filter((chat) =>
        chat.customerNumber.includes(search)
      );
    }

    // Filter berdasarkan rentang tanggal
    if (dateRange[0] && dateRange[1]) {
      filtered = filtered.filter((chat) =>
        chat.timestamp.isBetween(dateRange[0], dateRange[1], 'day', '[]')
      );
    }

    setFilteredChats(filtered);
  }, [search, dateRange, chats]);

  // Cek apakah teks adalah URL gambar atau video
  const renderChatContent = (text: string) => {
    if (/\.(jpg|jpeg|png|gif)$/i.test(text)) {
      return (
        <img src={text} alt="Image" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 5 }} />
      );
    } else if (/\.(mp4|webm|ogg)$/i.test(text)) {
      return (
        <video width="120" height="120" controls>
          <source src={text} type={`video/${text.split('.').pop()}`} />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <Tooltip title={text}>
          {text.length > 30 ? `${text.slice(0, 30)}...` : text}
        </Tooltip>
      );
    }
  };

  const columns = [
    { title: 'Chat ID', dataIndex: 'chatId', key: 'chatId' },
    { 
      title: 'Tanggal', 
      dataIndex: 'timestamp', 
      key: 'timestamp', 
      render: (date: Dayjs) => date.format('YYYY-MM-DD HH:mm:ss')
    },
    { title: 'No Customer', dataIndex: 'customerNumber', key: 'customerNumber' },
    { 
      title: 'Chat', 
      dataIndex: 'chat', 
      key: 'chat',
      render: renderChatContent
    },
  ];

  return (
    <div style={{ padding: 20, background: '#fff', borderRadius: 8 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <Input 
          placeholder="Input no customer" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{ width: 200 }} 
        />
        <RangePicker 
          onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null])} 
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={fetchChats}>Refresh</Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={filteredChats} 
        loading={loading} 
        rowKey="id" 
        pagination={{ pageSize: 10 }} 
      />
    </div>
  );
};

export { ReportLogChat };
