import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export default function SystemsSuspended() {
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="flex flex-col items-center justify-center md:m-2 md:mx-32 mx-4 my-6 h-full">
                    <FontAwesomeIcon icon={faExclamationTriangle} size="5x" className='text-yellow-500'/>
                    <h1 className="text-5xl font-bold my-2 text-center">
                        MLINX.co services are currently suspended.
                    </h1>
                    <p className="text-xl text-center">
                        <br /><br />
                        On March 6th 2024, Our database provider, PlanetScale, suffered a breach by the hands of a group known as "Capitalism". This group hypnotised the brain of PlanetScale executives using something known as "Greed", forcing them to do do something known as "being completely bloody heartless". Put simply (and less sarcastically), <a className='underline hover:no-underline' href='https://planetscale.com/blog/planetscale-forever#:~:text'>PlanetScale has taken the terribly unwise decision to retire their free tier (as well as dismiss most of their sales and marketing teams, which is some diabolical red flag, like pattern up??? ).</a> Since MLINX.co is a student project, we can't afford to pay for a database quite yet.
                        <br /><br />
                        As soon as we were made aware of this, we immediately began working on a solution. Unfortunately, since all our systems are engineered around their database systems and these events coinciding with the beginning of <a className='underline hover:no-underline' href="https://www.martin.bike">creator</a>'s crucial exam period, The lengthy process of finding a new database provider and migrating our systems to it will take some time. To ensure that services do not go down without warning, we have decided to suspend services until we are ready to relaunch with reliable, affordable infrastructure.
                        <br /><br />
                        Thankfully, MLINX.co is not a business-critical service, so we hope that this will not cause too much inconvenience. If you still require URL shortening services, we recommend using <a className='underline hover:no-underline' href="https://dub.co">Dub</a> in the meantime. Its what inspired us to make this in the first place, and it's a great service. We will also be providing a way to export your data from our systems in the near future, so you can easily migrate to another service.
                        <br /><br />
                        We are sorry for the inconvenience, and we hope to be back soon. Thank you for your understanding, and f*ck you, PlanetScale.
                    </p>
                </div>
            </div>
        </>
    )
}