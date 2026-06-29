GitHub\50-projects\Phase-2\1-TaskManager\backend> k6 run k6-load-test-fixed.js

         /\      Grafana   /‾‾/
    /\  /  \     |\  __   /  /
   /  \/    \    | |/ /  /   ‾‾\
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/


     execution: local
        script: k6-load-test-fixed.js
        output: -

     scenarios: (100.00%) 1 scenario, 10 max VUs, 1m40s max duration (incl. graceful stop):
              * default: Up to 10 looping VUs for 1m10s over 4 stages (gracefulRampDown: 30s, gracefulStop: 30s)

INFO[0000]  Starting load test with 10 users...          source=console
INFO[0071]  Load test completed!                         source=console


  █ THRESHOLDS

    http_req_duration
    ✓ 'p(95)<500' p(95)=454.83ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......: 1038   14.44145/s
    checks_succeeded...: 97.30% 1010 out of 1038
    checks_failed......: 2.69%  28 out of 1038

    ✓  User registered successfully
    ✓  Task created successfully
    ✓  Tasks retrieved successfully
    ✗  Response time under 200ms
      ↳  83% — ✓ 145 / ✗ 28
    ✓  Task updated successfully
    ✓  Task deleted successfully

    HTTP
    http_req_duration..............: avg=115.16ms min=1.08ms med=25.16ms max=732.39ms p(90)=352.1ms p(95)=454.83ms
      { expected_response:true }...: avg=115.16ms min=1.08ms med=25.16ms max=732.39ms p(90)=352.1ms p(95)=454.83ms
    http_req_failed................: 0.00%  0 out of 865
    http_reqs......................: 865    12.034542/s

    EXECUTION
    iteration_duration.............: avg=3.07s    min=2.61s  med=3.14s   max=3.32s    p(90)=3.29s   p(95)=3.3s
    iterations.....................: 173    2.406908/s
    vus............................: 1      min=1        max=10
    vus_max........................: 10     min=10       max=10

    NETWORK
    data_received..................: 392 kB 5.4 kB/s
    data_sent......................: 292 kB 4.1 kB/s




running (1m11.9s), 00/10 VUs, 173 complete and 0 interrupted iterations
default ✓ [======================================] 00/10 VUs  1m10s