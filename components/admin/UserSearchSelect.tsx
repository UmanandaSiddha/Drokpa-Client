"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { userService } from "@/services/user.service";
import type { User } from "@/types/auth";
import { Label } from "@/components/ui/label";

interface UserSearchSelectProps {
    value?: string;
    onSelect: (userId: string, user: User) => void;
    label?: string;
    placeholder?: string;
    required?: boolean;
}

export function UserSearchSelect({
    value,
    onSelect,
    label = "Select Host User",
    placeholder = "Search by name or email...",
    required = true,
}: UserSearchSelectProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length === 0) {
                setUsers([]);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await userService.getAllUsersAdmin({
                    keyword: searchQuery,
                    limit: 10,
                });
                setUsers(response.data || []);
            } catch (err) {
                setError("Failed to search users");
                setUsers([]);
            } finally {
                setIsLoading(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSelect = useCallback(
        (user: User) => {
            setSelectedUser(user);
            setSearchQuery("");
            setIsOpen(false);
            onSelect(user.id, user);
        },
        [onSelect]
    );

    return (
        <div className="space-y-2 relative">
            {label && <Label className="text-blue-900 font-semibold">{label}</Label>}

            <div className="relative">
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsOpen(true);
                            if (selectedUser) setSelectedUser(null);
                        }}
                        onFocus={() => {
                            if (searchQuery.trim()) setIsOpen(true);
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        required={required && !selectedUser}
                    />
                </div>

                {/* Dropdown */}
                {isOpen && (searchQuery.trim() || isLoading) && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-4">
                                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                <span className="ml-2 text-sm text-gray-600">Searching...</span>
                            </div>
                        ) : error ? (
                            <div className="flex items-start gap-2 p-3 text-red-600">
                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{error}</span>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="p-3 text-center text-gray-500 text-sm">No users found</div>
                        ) : (
                            users.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => handleSelect(user)}
                                    className="w-full text-left px-4 py-2.5 hover:bg-blue-50 border-b border-gray-100 last:border-0 transition-colors"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">
                                            {user.firstName} {user.lastName}
                                        </span>
                                        <span className="text-xs text-gray-500">{user.email}</span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Selected User Display */}
            {selectedUser && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-sm">
                        <span className="font-medium text-green-900">Selected Host: </span>
                        <span className="text-green-700">
                            {selectedUser.firstName} {selectedUser.lastName}
                        </span>
                    </div>
                    <span className="text-xs text-green-600">{selectedUser.email}</span>
                </div>
            )}

            {/* Click outside to close */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
