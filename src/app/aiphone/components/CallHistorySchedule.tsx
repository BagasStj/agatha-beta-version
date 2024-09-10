'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Table } from 'lucide-react';
import { z } from 'zod';
import { Skeleton } from "@/components/ui/skeleton";

export interface CallHistoryPropsSchedule {
    refreshTrigger: number;
}

const CallHistoryItemSchema = z.object({
    username: z.string(),
    phoneNumberId: z.string(),
    phoneNumber: z.string(),
    timestamp: z.string(),
    twilioPhoneNumber: z.string(),
    contact: z.string().optional(),
    userId: z.string(),
});

const ScheduledCallItemSchema = z.object({
    id: z.string(),
    userId: z.string(),
    scheduledTime: z.string(),
    status: z.string(),
    callData: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

const CallHistorySchema = z.array(CallHistoryItemSchema);
const ScheduledCallSchema = z.array(ScheduledCallItemSchema);

type CallHistoryItem = z.infer<typeof CallHistoryItemSchema>;
type ScheduledCallItem = z.infer<typeof ScheduledCallItemSchema>;

export default function CallHistorySchedule({ refreshTrigger }: CallHistoryPropsSchedule) {
    const [callHistory, setCallHistory] = useState<CallHistoryItem[]>([]);
    const [scheduledCalls, setScheduledCalls] = useState<ScheduledCallItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (user?.id) {
                setIsLoading(true);
                try {
                    // Fetch scheduled calls
                    const scheduledCallsResponse = await fetch(`/api/scheduled-calls?userId=${user.id}`);
                    if (scheduledCallsResponse.ok) {
                        const scheduledCallsData = await scheduledCallsResponse.json();
                        const validatedScheduledCallsData = ScheduledCallSchema.safeParse(scheduledCallsData);
                        if (validatedScheduledCallsData.success) {
                            setScheduledCalls(validatedScheduledCallsData.data);
                            console.log('Scheduled Calls:', validatedScheduledCallsData.data);
                        } else {
                            console.error('Data validation error:', validatedScheduledCallsData.error);
                            setError('Failed to validate scheduled calls data');
                        }
                    } else {
                        console.error('Failed to fetch scheduled calls');
                        setError('Failed to fetch scheduled calls');
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setError('Error fetching data');
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchData();
    }, [user, refreshTrigger]);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-4">
            {isLoading ? (
                <div className="space-y-2">
                    {[...Array(5)].map((_, index) => (
                        <Skeleton key={index} className="h-12 w-full" />
                    ))}
                </div>
            ) : callHistory.length === 0 && scheduledCalls.length === 0 ? (
                <p>No call history or scheduled calls available.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Phone Number</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled Time</th>
                                {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {scheduledCalls.map((call, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user?.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{JSON.parse(call.callData).customer.number}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{JSON.parse(call.callData).assistant.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(call.scheduledTime).toLocaleString()}</td>
                                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{call.status}</td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}