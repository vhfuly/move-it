import Head from 'next/head'
import { GetServerSideProps } from 'next';

import { CompletedChallenges } from '../components/CompletedChallenges';
import { Countdown } from '../components/Countdown';
import { ExperienceBar } from '../components/ExperienceBar';
import { Profile } from '../components/Profile';
import { ChallengeBox } from '../components/ChallengeBox';
import { CountdownProvider } from '../contexts/CountdownContext';
import styles from '../styles/pages/Home.module.css';
import { ChallengesProvider } from '../contexts/ChallengesContext';
import { SideBar } from '../components/Sidebar';
import { useSession } from 'next-auth/client';
import Login from '../components/Login';
import useSWR from 'swr';
import api from '../utils/api';
import { Loader } from '../components/Loader';
import { signOut } from 'next-auth/client'
interface HomeProps {
  level: number,
  currentExperience: number,
  challengesCompleted: number,

}

//As props são acessadas da função getServerSideProps
export default function Home(props: HomeProps) {
  const [ session, loading ] = useSession()
  // const { data, error } = useSWR('api/data', api)
  // if (error) {
  //   console.log(error)
  // }

  // if (data) {
  //   console.log(data)
  // }
  return (
   
    <ChallengesProvider
    level={props.level}
    currentExperience={props.currentExperience}
    challengesCompleted={props.challengesCompleted}
    >
      {!session &&
        <Login />
      }
      {loading &&
        <Loader />
      }
      {session &&
      <div className={styles.overlay}>
      <SideBar
        home = {true}
        award = {false}
        />
      <div className={styles.container}>

        <Head>
          <title>Início | move.it</title>
        </Head>

        <div className={styles.signout}>
            <button onClick={() => signOut()}> <img src="/icons/out.svg" alt="out"/> </button>
        </div>
        <ExperienceBar />
         
        <CountdownProvider>
          <section>
            <div>
              <Profile />
              <CompletedChallenges />
              <Countdown />
            </div>

            <div>
              <ChallengeBox />
            </div>
          </section>
        </CountdownProvider>
        
      </div>
      </div>
      }
    </ChallengesProvider>
  )
}

//todas as chamadas no getServerSideProps serão feitas antes de finalizar a tela
//utilizado para dados de SEO que estão no banco de dados.
export const getServerSideProps: GetServerSideProps = async (ctx) => {

  const { level, currentExperience, challengesCompleted } = ctx.req.cookies;
  return {
    props: {
      level: Number(level),
      currentExperience: Number(currentExperience),
      challengesCompleted: Number(challengesCompleted),
    }
  }
}
