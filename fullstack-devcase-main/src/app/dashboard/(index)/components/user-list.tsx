"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AddUserModal } from './add-user-modal';
import {
  CalendarIcon,
  EllipsisVerticalIcon,
  FunnelIcon,
  PlusCircleIcon,
  RefreshCwIcon,
  Search,
  SearchIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import CommentsDataTable from "./data-table";

export default function UserList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Token'ı direkt localStorage'dan al
  const [token, setToken] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [sorting, setSorting] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Token'ı yükle
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }
  }, []);

  // URL'den parametreleri al
  const page = Number(searchParams.get('page')) || 1;
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const order = searchParams.get('order') || 'desc';

  const fetchUsers = async () => {
    if (!token) {
      console.warn('No token found');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 10,
        sortBy,
        order,
      };
      
      // search varsa ekle (undefined olarak gönderme)
      if (search) {
        params.search = search;
      }

      const response = await api.users.getAll(token, params);

      if (response.success) {
        setData(response.data.data);
        setPagination({
          page: response.data.pagination.page,
          totalPages: response.data.pagination.totalPages,
          totalItems: response.data.pagination.total,
        });
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [page, sortBy, order, search, token]);

  const handlePaginationChange = (pageIndex: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(pageIndex + 1));
    router.push(`/dashboard?${params.toString()}`);
  };

  const handleSortingChange = (newSorting: any[]) => {
    setSorting(newSorting);
    if (newSorting.length > 0) {
      const params = new URLSearchParams(searchParams);
      params.set('sortBy', newSorting[0].id);
      params.set('order', newSorting[0].desc ? 'desc' : 'asc');
      router.push(`/dashboard?${params.toString()}`);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.push(`/dashboard?${params.toString()}`);
  };

  if (loading) {
    return (
      <Card className="gap-10 p-[30px]">
        <p>Loading...</p>
      </Card>
    );
  }

  return (
    <Card className="gap-10 p-[30px]">
      <div className="flex justify-between items-center gap-2">
        <p className="flex-1 font-bold text-xl">All Users</p>
        <div className="relative hidden md:block">
          <Input 
            placeholder="Search here" 
            className="pl-10 py-2!" 
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute left-px top-px p-[12px] [&_svg]:size-5!"
          >
            <Search />
          </Button>
        </div>
        <Button size="icon" variant="ghost" className="border md:hidden">
          <SearchIcon />
        </Button>
        <Button 
          size="icon" 
          variant="ghost" 
          className="border hidden md:flex"
          onClick={fetchUsers}
        >
          <RefreshCwIcon />
        </Button>
        <Button size="icon" variant="ghost" className="border hidden md:flex">
          <CalendarIcon />
        </Button>
        <Button size="icon" variant="ghost" className="border hidden md:flex">
          <FunnelIcon />
        </Button>
        <Button size="icon" variant="ghost" className="border">
          <EllipsisVerticalIcon />
        </Button>
        <Button onClick={() => setShowAddModal(true)}>
          <PlusCircleIcon /> Add New User
        </Button>
      </div>
      <CommentsDataTable
        data={data}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        onSortingChange={handleSortingChange}
        sorting={sorting}
      />
      <AddUserModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSuccess={fetchUsers}
        token={token || ''}
      />
    </Card>
  );
}