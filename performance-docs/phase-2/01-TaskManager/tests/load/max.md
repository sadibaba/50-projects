GitHub\50-projects\Phase-2\1-TaskManager\backend> k6 run k6-find-max-users.js

         /\      Grafana   /‾‾/
    /\  /  \     |\  __   /  /
   /  \/    \    | |/ /  /   ‾‾\
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/


     execution: local
        script: k6-find-max-users.js
        output: -

     scenarios: (100.00%) 1 scenario, 50 max VUs, 3m10s max duration (incl. graceful stop):
              * default: Up to 50 looping VUs for 2m40s over 11 stages (gracefulRampDown: 30s, gracefulStop: 30s)



  █ THRESHOLDS

    http_req_duration
    ✗ 'p(95)<500' p(95)=3.88s

    http_req_failed
    ✓ 'rate<0.05' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......: 5664   35.245118/s
    checks_succeeded...: 99.48% 5635 out of 5664
    checks_failed......: 0.51%  29 out of 5664

    ✓ Register
    ✓ Create
    ✓ Get
    ✗ Fast
      ↳  96% — ✓ 915 / ✗ 29
    ✓ Update
    ✓ Delete

    HTTP
    http_req_duration..............: avg=600.79ms min=536.9µs med=26.35ms max=6s    p(90)=2.96s p(95)=3.88s
      { expected_response:true }...: avg=600.79ms min=536.9µs med=26.35ms max=6s    p(90)=2.96s p(95)=3.88s
    http_req_failed................: 0.00%  0 out of 4720
    http_reqs......................: 4720   29.370931/s

    EXECUTION
    iteration_duration.............: avg=4.9s     min=2.02s   med=5.16s   max=8.04s p(90)=6.77s p(95)=7.67s
    iterations.....................: 944    5.874186/s
    vus............................: 16     min=1         max=50
    vus_max........................: 50     min=50        max=50

    NETWORK
    data_received..................: 2.0 MB 12 kB/s
    data_sent......................: 1.5 MB 9.4 kB/s




running (2m40.7s), 00/50 VUs, 944 complete and 0 interrupted iterations
default ✓ [======================================] 00/50 VUs  2m40s


30 users par fail (p95 3.88s), max capacity = 20-25 users