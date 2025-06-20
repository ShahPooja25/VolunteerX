import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

const SuggestedUsers = () => {
    const { suggestedUsers } = useSelector(store => store.auth);
    return (
        <div className='my-10 bg-white rounded-2xl shadow-md p-6'>
            <div className='flex items-center justify-between text-sm mb-6'>
                <h1 className='font-bold text-lg text-green-800'>Suggested for you</h1>
                <Button variant="link" className='font-medium text-green-600 hover:text-green-800'>
                    See All
                </Button>
            </div>
            {suggestedUsers.map((user) => (
                <div key={user._id} className='flex items-center justify-between my-5 hover:bg-green-50 p-3 rounded-xl transition-all duration-300'>
                    <div className='flex items-center gap-4'>
                        <Link to={`/profile/${user?._id}`}>
                            <Avatar className="w-12 h-12">
                                <AvatarImage src={user?.profilePicture} alt="profile_image" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </Link>
                        <div>
                            <h1 className='font-semibold text-sm text-gray-800'>
                                <Link to={`/profile/${user?._id}`} className="hover:text-green-600 transition-colors">
                                    {user?.username}
                                </Link>
                            </h1>
                            <span className='text-gray-600 text-xs'>{user?.bio.slice(0,20) || 'Bio here...'}</span>
                        </div>
                    </div>
                    <Button variant="outline" className='text-green-600 ml-4 text-xs font-bold hover:bg-green-100 hover:text-green-800 transition-colors'>
                        Follow
                    </Button>
                </div>
            ))}
        </div>
    )
}

export default SuggestedUsers