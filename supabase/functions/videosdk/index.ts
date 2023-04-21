// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import jwt from 'https://esm.sh/jsonwebtoken@8.5.1';
// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import { corsHeaders } from '../_shared/cors.ts';

console.log('Hello from VideoSDK Functions!');

serve(async (req) => {
  // func: function name (getMeetingId / getAuthToken)
  // authToken: if getMeetingId is called
  // // topicId: getMeetingId
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // const supabaseClient = createClient(
  //   // Supabase API URL - env var exported by default.
  //   Deno.env.get('SUPABASE_URL') ?? '',
  //   // Supabase API ANON KEY - env var exported by default.
  //   Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  //   // Create client with Auth context of the user that called the function.
  //   // This way your row-level-security (RLS) policies are applied.
  //   {
  //     global: { headers: { Authorization: req.headers.get('Authorization')! } }
  //   }
  // );

  // const {
  //   data: { user }
  // } = await supabaseClient.auth.getUser();

  try {
    const reqjson = await req.json();
    const { func } = reqjson;

    let data: object | null = null;
    if (func === 'getMeetingId') {
      data = await getMeetingId(reqjson.authToken);
    } else if (func === 'getAuthToken') data = getAuthToken();

    if (!data) throw new Error('invalid method');
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
});

const getMeetingId = async (authToken: string) => {
  let meetingId: string;

  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: 'POST',
    headers: {
      authorization: `${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });
  const resjson = await res.json();
  meetingId = resjson.roomId;
  console.log(resjson);
  return { meetingId };
};

const getAuthToken = () => {
  const API_KEY =
    Deno.env.get('VIDEOSDK_API_KEY') ??
    throwExpression('VIDEOSDK_API_KEY not defined');
  const SECRET_KEY =
    Deno.env.get('VIDEOSDK_SECRET_KEY') ??
    throwExpression('VIDEOSDK_SECRET_KEY not defined');

  const options = { expiresIn: '10m', algorithm: 'HS256' };

  const payload = {
    apikey: API_KEY,
    permissions: ['allow_join', 'allow_mod'] // also accepts "ask_join"
  };

  const token = jwt.sign(payload, SECRET_KEY, options as any);
  return { token };
};

const throwExpression = (errorMessage: string) => {
  throw new Error(errorMessage);
};

// To invoke:
// getAuthToken
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"func":"getAuthToken"}'

// getMeetingId
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"func":"getMeetingId", "authToken": [YOUR_AUTH_TOKEN]}'
