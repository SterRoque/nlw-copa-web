import Image from 'next/image'
import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import logoImg from '../assets/logo.svg'
import usersAvatarExempleImg from '../assets/users-avatar-exemple.png'
import iconChechImg from '../assets/icon-check.svg'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'

interface HomeProps {
  poolCount: number
  guessCount: number
  userCount: number
}

export default function Home({ poolCount: poolCountInitial, guessCount, userCount }: HomeProps) {

  const [poolTitle, setPoolTitle] = useState<string>('')
  const [poolCount, setPoolCount] = useState<number>(poolCountInitial)

  async function createPool(event: FormEvent) {
    event.preventDefault()

    try {
      const { data } = await api.post('/pools', {
        title: poolTitle,
      });

      await navigator.clipboard.writeText(data.code)

      alert('Bolão criado com sucesso, o código foi copiado para área de transferência')
      alert('Seu código: ' + data.code)

      setPoolCount(prev => prev + 1)
      setPoolTitle('')

    } catch (err) {
      console.log(err)
      alert('Falha ao criar o bolão, tente novamente!')
    }

  }



  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center'>
      <main>
        <Image src={logoImg} alt="NlW Copa" />

        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={usersAvatarExempleImg} alt="" />
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{userCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className='mt-10 flex gap-2'>
          <input
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
            type="text"
            required
            placeholder='Qual nome do seu bolão?'
            value={poolTitle}
            onChange={e => setPoolTitle(e.target.value)}
          />
          <button
            className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700'
            type="submit"
          >
            criar meu bolão
          </button>
        </form>

        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100' >
          <div className='flex items-center gap-6'>
            <Image src={iconChechImg} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text text-2xl'>+{poolCount}</span>
              <span>Bolões criados </span>
            </div>
          </div>

          <div className='w-px h-14 bg-gray-600'></div>

          <div className='flex items-center gap-6'>
            <Image src={iconChechImg} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text text-2xl'>+{guessCount}</span>
              <span>Palpites enviados </span>
            </div>
          </div>
        </div>

      </main>
      <Image
        src={appPreviewImg}
        alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
        quality={100}
      />
    </div>
  )
}

export const getServerSideProps = async () => {

  const [
    poolCountResponse,
    guessCountResponse,
    usersCountResponse
  ] = await Promise.all([
    api.get("pools/count"),
    api.get("guesses/count"),
    api.get("users/count"),
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: usersCountResponse.data.count
    }
  }
}