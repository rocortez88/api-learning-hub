import styles from './RequestViewer.module.css';

export interface RequestViewerProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  requestBody?: object;
  responseStatus?: number;
  responseBody?: object;
  loading?: boolean;
}

const METHOD_COLOR: Record<string, string> = {
  GET: styles.methodGet ?? '',
  POST: styles.methodPost ?? '',
  PUT: styles.methodPut ?? '',
  DELETE: styles.methodDelete ?? '',
  PATCH: styles.methodPatch ?? '',
};

function statusColorClass(status?: number): string {
  if (status === undefined) return '';
  if (status >= 200 && status < 300) return styles.statusOk ?? '';
  if (status >= 300 && status < 400) return styles.statusRedirect ?? '';
  if (status >= 400 && status < 500) return styles.statusClientError ?? '';
  return styles.statusServerError ?? '';
}

function httpStatusText(status: number): string {
  const map: Record<number, string> = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    301: 'Moved Permanently',
    302: 'Found',
    304: 'Not Modified',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
  };
  return map[status] ?? '';
}

export default function RequestViewer({
  method,
  url,
  requestBody,
  responseStatus,
  responseBody,
  loading = false,
}: RequestViewerProps) {
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={`${styles.panel} ${styles.skeleton}`}>
          <div className={styles.skeletonLine} style={{ width: '40%' }} />
          <div className={styles.skeletonLine} style={{ width: '70%' }} />
          <div className={styles.skeletonLine} style={{ width: '55%' }} />
        </div>
        <div className={styles.divider} />
        <div className={`${styles.panel} ${styles.skeleton}`}>
          <div className={styles.skeletonLine} style={{ width: '25%' }} />
          <div className={styles.skeletonLine} style={{ width: '80%' }} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* ── Request panel ── */}
      <div className={styles.panel}>
        <p className={styles.panelLabel}>Request</p>
        <div className={styles.requestLine}>
          <span className={`${styles.method} ${METHOD_COLOR[method] ?? ''}`}>
            {method}
          </span>
          <span className={styles.url}>{url}</span>
        </div>
        {requestBody !== undefined && (
          <div className={styles.bodySection}>
            <p className={styles.bodyLabel}>Body</p>
            <pre className={styles.codeBlock}>
              {JSON.stringify(requestBody, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className={styles.divider} />

      {/* ── Response panel ── */}
      <div className={styles.panel}>
        <p className={styles.panelLabel}>Response</p>
        {responseStatus === undefined ? (
          <p className={styles.emptyResponse}>Sin respuesta aún.</p>
        ) : (
          <>
            <div className={styles.statusLine}>
              <span className={`${styles.statusCode} ${statusColorClass(responseStatus)}`}>
                {responseStatus}
              </span>
              <span className={styles.statusText}>
                {httpStatusText(responseStatus)}
              </span>
            </div>
            {responseBody !== undefined && (
              <div className={styles.bodySection}>
                <p className={styles.bodyLabel}>Body</p>
                <pre className={styles.codeBlock}>
                  {JSON.stringify(responseBody, null, 2)}
                </pre>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
