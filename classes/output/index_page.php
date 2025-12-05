<?php

    namespace report_autograder\output;
    defined('MOODLE_INTERNAL') || die();
    use renderable;
    use renderer_base;
    use templatable;
    use stdClass;

    class index_page implements renderable, templatable
    {
        private $dataToRender = null;

        private $additionalData;

        public function __construct($dataToRender, $additionalData)
        {
            $this->dataToRender = $dataToRender;
            $this->additionalData = $additionalData;
        }

        public function export_for_template(renderer_base $output): stdClass
        {
            $data = new stdClass();
            $data->dataToRender = $this->dataToRender;
            $data->additionalData = $this->additionalData;
            return $data;
        }
    }