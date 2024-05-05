const glados = async () => {
  const cookie = process.env.GLADOS
  if (!cookie) return ['Checkin Error', 'Missing GLADOS cookie']
  try {
    const headers = {
      'cookie': cookie,
      'referer': 'https://glados.rocks/console/checkin',
      'user-agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
    }
    const checkin = await fetch('https://glados.rocks/api/user/checkin', {
      method: 'POST',
      headers: { ...headers, 'content-type': 'application/json' },
      body: '{"token":"glados.one"}',
    }).then((r) => r.json())
    const status = await fetch('https://glados.rocks/api/user/status', {
      method: 'GET',
      headers,
    }).then((r) => r.json())

    // 调试输出
    console.log('Status:', status)

    // 检查 status.data 是否存在以及 leftDays 属性是否存在
    const leftDays = status.data && status.data.leftDays ? Number(status.data.leftDays) : NaN

    // 调试输出
    console.log('Left Days:', leftDays)

    return [
      'Checkin OK',
      `${checkin.message}`,
      `Left Days ${isNaN(leftDays) ? 'Unknown' : leftDays}`,
    ]
  } catch (error) {
    return [
      'Checkin Error',
      `${error}`,
      `<${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}>`,
    ]
  }
}

const notify = async (contents) => {
  const token = process.env.NOTIFY
  if (!token || !contents) return
  await fetch(`https://www.pushplus.plus/send`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      token,
      title: contents[0],
      content: contents.join('<br>'),
      template: 'markdown',
    }),
  })
}

const main = async () => {
  await notify(await glados())
}

main()
