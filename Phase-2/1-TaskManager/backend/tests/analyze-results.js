import fs from 'fs';

console.log(' Analyzing Load Test Results...\n');

try {
  const data = fs.readFileSync('results/load-test-results.json', 'utf8');
  const lines = data.trim().split('\n');
  
  let metrics = {
    http_req_duration: { values: [] },
    http_req_waiting: { values: [] },
    http_req_receiving: { values: [] },
    http_req_sending: { values: [] },
    http_reqs: 0,
    http_req_failed: 0,
  };

  lines.forEach(line => {
    try {
      const entry = JSON.parse(line);
      if (entry.type === 'Point') {
        const metric = entry.metric;
        const value = entry.data?.value;
        
        if (metric && value !== undefined) {
          if (['http_req_duration', 'http_req_waiting', 'http_req_receiving', 'http_req_sending'].includes(metric)) {
            if (!metrics[metric]) metrics[metric] = { values: [] };
            metrics[metric].values.push(value);
          } else if (metric === 'http_reqs') {
            metrics.http_reqs = value;
          } else if (metric === 'http_req_failed') {
            metrics.http_req_failed = value;
          }
        }
      }
    } catch (e) {
      // Skip invalid JSON lines
    }
  });

  // Calculate statistics
  const calculateStats = (values) => {
    if (!values || values.length === 0) return { avg: 0, min: 0, max: 0, p95: 0 };
    const sorted = [...values].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    const avg = sum / sorted.length;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    return { avg, min, max, p95 };
  };

  console.log('========================================');
  console.log('  LOAD TEST RESULTS SUMMARY');
  console.log('========================================\n');

  // Response Time Stats
  console.log(' RESPONSE TIMES:');
  const durationStats = calculateStats(metrics.http_req_duration.values);
  console.log(`   Average: ${durationStats.avg.toFixed(2)}ms`);
  console.log(`   Minimum: ${durationStats.min.toFixed(2)}ms`);
  console.log(`   Maximum: ${durationStats.max.toFixed(2)}ms`);
  console.log(`   95th percentile: ${durationStats.p95.toFixed(2)}ms`);
  
  const waitingStats = calculateStats(metrics.http_req_waiting.values);
  console.log(`   Server Wait Time: ${waitingStats.avg.toFixed(2)}ms`);
  console.log('');

  // Request Stats
  console.log(' REQUEST STATISTICS:');
  console.log(`   Total Requests: ${metrics.http_reqs}`);
  console.log(`   Failed Requests: ${metrics.http_req_failed}`);
  console.log(`   Success Rate: ${((1 - metrics.http_req_failed / metrics.http_reqs) * 100).toFixed(2)}%`);
  console.log('');

  // Performance Assessment
  console.log(' PERFORMANCE ASSESSMENT:');
  if (durationStats.p95 < 100) {
    console.log('    EXCELLENT: 95% of requests < 100ms');
  } else if (durationStats.p95 < 200) {
    console.log('    GOOD: 95% of requests < 200ms');
  } else if (durationStats.p95 < 500) {
    console.log('    ACCEPTABLE: 95% of requests < 500ms');
  } else {
    console.log('    NEEDS IMPROVEMENT: 95% of requests > 500ms');
  }
  console.log('');

  // Compare with targets
  console.log(' TARGET COMPARISON:');
  const targets = [
    { name: 'API Response Time', min: 500, good: 200, excellent: 100, value: durationStats.p95 },
    { name: 'Success Rate', min: 95, good: 99, excellent: 99.9, value: (1 - metrics.http_req_failed / metrics.http_reqs) * 100 },
  ];

  targets.forEach(target => {
    let status = '';
    if (target.value >= target.excellent) status = '';
    else if (target.value >= target.good) status = '';
    else if (target.value >= target.min) status = '';
    
    const unit = target.name.includes('Rate') ? '%' : 'ms';
    console.log(`   ${status} ${target.name}: ${target.value.toFixed(2)}${unit} (Target: ${target.good}${unit})`);
  });
  console.log('');

} catch (error) {
  console.error(' Error analyzing results:', error.message);
  console.log('\nMake sure you have run the load test first:');
  console.log('  - Run: ./run-tests.sh (Mac/Linux) or run-tests.bat (Windows)');
  console.log('  - Or with Docker: docker run --rm -v ./:/scripts grafana/k6 run /scripts/k6-load-test.js');
}