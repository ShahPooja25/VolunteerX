"use client"

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { useToast } from './ui/use-toast'

const VolunteerDashboard = () => {
    const { user } = useSelector(store => store.auth)
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        const fetchVolunteerStats = async () => {
            try {
                const response = await axios.get(`/api/volunteer/stats/${user._id}`)
                setStats(response.data)
                setLoading(false)
            } catch (error) {
                // Fallback mock data when API is not available
                setStats({
                    hoursCompleted: 12,
                    eventsAttended: 3,
                    upcomingEvents: [
                        {id: 1, name: "Community Cleanup"},
                        {id: 2, name: "Food Drive"}
                    ]
                })
                setLoading(false)
                console.log("Using mock data - API not available")
            }
        }
        fetchVolunteerStats()
    }, [user._id, toast])

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Volunteer Dashboard</h1>
            
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p>Loading dashboard...</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Hours Completed</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{stats.hoursCompleted}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Events Attended</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{stats.eventsAttended}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Upcoming Events</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{stats.upcomingEvents.length}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                            <Button variant="outline">View Events</Button>
                            <Button variant="outline">Update Availability</Button>
                            <Button variant="outline">View Certificates</Button>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}

export default VolunteerDashboard
